import re

file_path = "/home/alankrit/Desktop/emi-calculator/app/eligibility/components/lenderEngine.js"
with open(file_path, "r") as f:
    content = f.read()

updates = {
    "icici": "10.80",
    "idfc": "9.99",
    "bajaj": "10.00",
    "shriram": "11.50",
    "ltfinance": "10.50",
    "abfl": "10.99",
    "axis": "9.99",
    "poonawalla": "18.00",
    "hdb": "10.75",
    "piramal": "12.00",
    "mahindra": "8.00",
    "iifl": "10.75",
    "federal": "11.99",
    "rbl": "14.00"
}

for lender_id, rate in updates.items():
    pattern = rf'(id:\s*"{lender_id}",[\s\S]*?headlineRate:\s*)\d+\.\d+'
    content = re.sub(pattern, rf'\g<1>{rate}', content, count=1)

with open(file_path, "w") as f:
    f.write(content)
