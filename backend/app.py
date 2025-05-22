from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
import bcrypt
from datetime import datetime
import pytz
from bson import ObjectId  # Import ObjectId

# routes/admin.py or wherever your admin routes are defined
from flask import Blueprint, jsonify


admin_routes = Blueprint('admin_routes', __name__)

@admin_routes.route('/api/employees/count', methods=['GET'])
@jwt_required()
def count_employees():
    count = employees_collection.count_documents({})
    return jsonify({"employee_count": count})

app = Flask(__name__)
# Enable CORS for the specific frontend domain
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.config["JWT_SECRET_KEY"] = "your_secret_key"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # 🔐 No expiry
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = False  # Optional

jwt = JWTManager(app)

# MONGODB CONNECTION
client = MongoClient("mongodb+srv://test:test@cluster0.81qy6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["employee_payroll_management_system"]
admins_collection = db["admins"]
employees_collection = db["employees"]

#FUNCTION TO HASH PASSWORD
def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

#FUNCTION TO VERIFY PASSWORD
def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode("utf-8"), hashed)

# Set timezone to Philippine Time (PHT)
ph_timezone = pytz.timezone("Asia/Manila")
ph_time = datetime.now(ph_timezone)

print("Current Philippine Time:", ph_time.strftime("%Y-%m-%d %H:%M:%S"))


#CREATE ADMIN ACCOUNT VIA POSTMAN
@app.route('/create/admin', methods=["POST"])
def create_admin():
    data = request.json

    #CONDITION CHECK THE EMAIL IF IT IS ALREADY EXIST
    if admins_collection.find_one({"email": data["email"]}):
        return jsonify({"message": "Email already exist"}), 400
    
    #HASH PASSWORD BEFORE IT TO STORE
    hashed_password = hash_password(data["password"])

    admin = {
        "email": data["email"],
        "password": hashed_password,
        "role": "admin"
    }
    admins_collection.insert_one(admin)
    return jsonify({"message": "Admin account created successfully"}),201

#LOGIN ROUTE
@app.route('/login', methods=["POST"])
def login():
    data = request.json
    user = admins_collection.find_one({"email": data["email"]}) or employees_collection.find_one({"email": data["email"]})

    if user and verify_password(data["password"], user["password"]):
        access_token = create_access_token(identity=user["email"])
        role = user.get("role", "employee") #DEFAULT TO EMPLOYEE IF NO ROLE
        return jsonify({"access_token": access_token, "role": role}),200
    
    return jsonify({"message": "Invalid email or password"}), 401

# Initialize Counter if Not Exists
if not db.counters.find_one({"_id": "employee_id"}):
    db.counters.insert_one({"_id": "employee_id", "seq": 1000})

def get_next_employee_id():
    counter = db.counters.find_one_and_update(
        {"_id": "employee_id"},
        {"$inc": {"seq": 1}},  # Increment counter
        return_document=True
    )
    return str(counter["seq"])

# ADMIN CREATE EMPLOYEE ACCOUNT
@app.route('/admin/create/employee-account', methods=["POST"])
@jwt_required()
def create_employee():
    current_user_email = get_jwt_identity()
    user = admins_collection.find_one({"email": current_user_email})

    if not user or user["role"] != "admin":
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.json

    if employees_collection.find_one({"email": data["email"]}):
        return jsonify({"message": "Email already exists"}), 400
    
    # Get next available employee_id
    employee_id = get_next_employee_id()

    # Set up Philippine Time
    ph_timezone = pytz.timezone("Asia/Manila")
    created_at = datetime.now(ph_timezone).strftime("%Y-%m-%d %H:%M:%S")

    # Hash password before storing it
    hashed_password = hash_password(data["password"])
    employee_account = {
        "employee_id": employee_id,  # Auto-generated
        "email": data["email"],
        "password": hashed_password,
        "firstname": data["firstname"],
        "lastname": data["lastname"],
        "address": data["address"],
        "working_status": data["working_status"],
        "department": data["department"],
        "basic_salary": None,
        "num_days": None,
        "over_time": None,
        "bonus": None,
        "tax_deduction": None,
        "insurance_deduction": None,
        "net_salary": None,
        "total": None,
        "payslip_start": None,
        "payslip_end": None,
        "payslip_month_year": None,
        "created_at": created_at
    }

    employees_collection.insert_one(employee_account)
    return jsonify({"message": "Employee account created successfully", "employee_id": employee_id}), 201

@app.route('/admin/employees', methods=["GET"])
@jwt_required()
def get_employees():
    employees = list(employees_collection.find({}, {"_id": 0, "password": 0, "confirm_password": 0}))

    return jsonify(employees), 200

# DELETE EMPLOYEE ROUTE
@app.route('/admin/employee/<employee_id>', methods=["DELETE"])
@jwt_required()
def delete_employee(employee_id):
    current_user_email = get_jwt_identity()
    admin = admins_collection.find_one({"email": current_user_email})

    # Ensure only admin can delete employees
    if not admin or admin.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 403

    # Check if employee exists
    employee = employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    # Delete employee from database
    employees_collection.delete_one({"employee_id": employee_id})
    return jsonify({"message": f"Employee {employee_id} deleted successfully"}), 200

# VIEW Employee Profile
@app.route('/admin/employee-profile/<employee_id>', methods=["GET"])
@jwt_required()
def get_employee_profile(employee_id):
    employee = employees_collection.find_one(
        {"employee_id": str(employee_id)}, {"_id": 0, "password": 0, "confirm_password": 0}
    )
    
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    return jsonify(employee), 200

# VIEW Employee Payslip
@app.route('/admin/employee-payslip/<employee_id>', methods=["GET"])
@jwt_required()
def get_employee_payslip(employee_id):
    employee = employees_collection.find_one(
        {"employee_id": str(employee_id)}, {"_id": 0, "password": 0, "confirm_password": 0}
    )
    
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    return jsonify(employee), 200


# UPDATE EMPLOYEE DETAILS
@app.route('/admin/employee/<employee_id>', methods=["PUT"])
@jwt_required()
@cross_origin(origins="http://localhost:5173")
def update_employee(employee_id):
    current_user_email = get_jwt_identity()
    admin = admins_collection.find_one({"email": current_user_email})

    if not admin or admin.get("role") != "admin":
        return jsonify({"message": "Unauthorized"}), 403

    data = request.json

    existing_employee = employees_collection.find_one({
        "email": data["email"],
        "employee_id": {"$ne": employee_id}
    })
    if existing_employee:
        return jsonify({"message": "Email already exists. Please use a different email."}), 400

    update_fields = {
        "firstname": data["firstname"],
        "lastname": data["lastname"],
        "department": data["department"],
        "working_status": data["working_status"],
        "email": data["email"]
    }

    # Check if payslip-related fields are provided
    payslip_keys = ["num_days", "basic_salary", "bonus", "over_time", 
                    "payslip_start", "payslip_end", "payslip_month_year"]

    if all(k in data and data[k] not in [None, ""] for k in payslip_keys):
        try:
            num_days = int(data.get("num_days", 0))
            basic_salary = float(data.get("basic_salary", 0))
            bonus = float(data.get("bonus", 0))
            over_time = float(data.get("over_time", 0))

            tax_rate = 0.1
            insurance_rate = 0.05

            total_earnings = (basic_salary * num_days) + over_time + bonus
            tax_deduction = total_earnings * tax_rate
            insurance_deduction = total_earnings * insurance_rate
            net_salary = total_earnings - (tax_deduction + insurance_deduction)

            update_fields.update({
                "num_days": num_days,
                "basic_salary": basic_salary,
                "bonus": bonus,
                "over_time": over_time,
                "tax_deduction": tax_deduction,
                "insurance_deduction": insurance_deduction,
                "net_salary": net_salary,
                "total": total_earnings,
                "payslip_start": data.get("payslip_start"),
                "payslip_end": data.get("payslip_end"),
                "payslip_month_year": data.get("payslip_month_year")
            })
        except (ValueError, TypeError):
            return jsonify({"message": "Invalid payslip values"}), 400

    result = employees_collection.update_one({"employee_id": employee_id}, {"$set": update_fields})

    if result.modified_count == 0:
        return jsonify({"message": "No changes made or Employee not found"}), 400

    return jsonify({
        "message": "Employee updated successfully",
        "updated_fields": update_fields
    }), 200


@app.route('/employee/dashboard', methods=["GET"])
@jwt_required()
def employee_dashboard():
    current_user_email = get_jwt_identity()
    employee = employees_collection.find_one(
        {"email": current_user_email},
        {"_id": 0, "password": 0, "confirm_password": 0}
    )

    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    return jsonify(employee), 200



if __name__ == "__main__":
    app.run(debug=True)
