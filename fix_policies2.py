import re

file_path = "/home/alankrit/Desktop/emi-calculator/app/eligibility/components/lenderEngine.js"
with open(file_path, "r") as f:
    content = f.read()

updates = {
    "shriram": {"headlineRate": "11.00"},
    "piramal": {"headlineRate": "12.99"},
    "tata": {"maxTenure": "72"},
    "ltfinance": {"maxTenure": "72"},
    "bajaj": {"min_cibil": "650"},
    "yesbank": {"headlineRate": "10.85", "maxTenure": "72"},
    "rbl": {"maxTenure": "36"},
    "mahindra": {"headlineRate": "12.75"},  # Restoring old fallback
    "poonawalla": {"headlineRate": "15.00"}, # Safe fallback
    "hdb": {"headlineRate": "15.00"},
    "chola": {"headlineRate": "15.00"},
    "iifl": {"headlineRate": "15.00"}
}

for lender_id, changes in updates.items():
    for key, value in changes.items():
        pattern = rf'(id:\s*"{lender_id}",[\s\S]*?{key}:\s*)\d+(?:\.\d+)?'
        content = re.sub(pattern, rf'\g<1>{value}', content, count=1)

with open(file_path, "w") as f:
    f.write(content)

print("Done updating policies 2.")
