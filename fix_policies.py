import re

file_path = "/home/alankrit/Desktop/emi-calculator/app/eligibility/components/lenderEngine.js"
with open(file_path, "r") as f:
    content = f.read()

# Find the LENDERS array content
match = re.search(r'const LENDERS = \[([\s\S]*?)\];\n\nexport function analyzeLenderEligibility', content)
if not match:
    print("Could not find LENDERS array")
    exit(1)

lenders_str = match.group(1)

# Split into individual lender blocks
# Using a simple split by "  }," isn't perfect but works if we re-join
blocks = re.split(r'  \},\n  \{', lenders_str)

new_blocks = []
for i, block in enumerate(blocks):
    # Add back the braces that were split
    if i == 0:
        block = block
    else:
        block = "  {\n" + block
    
    if i == len(blocks) - 1:
        pass # The last block doesn't end with "  }," it ends with "  }" which is handled by the regex end

    # Extract ID and Type
    id_match = re.search(r'id:\s*"([^"]+)"', block)
    type_match = re.search(r'type:\s*"([^"]+)"', block)
    
    if id_match and type_match:
        lender_id = id_match.group(1)
        lender_type = type_match.group(1)
        
        cc_policy = ""
        app_policy = ""
        
        if lender_type == "Private Bank":
            if lender_id == "axis":
                cc_policy = "CONFIRMED"
                app_policy = "CONFIRMED"
            else:
                cc_policy = "NOT_SUPPORTED"
                app_policy = "NOT_SUPPORTED"
        elif lender_type == "NBFC":
            cc_policy = "CONFIRMED"
            app_policy = "CONFIRMED"
            
        if cc_policy and app_policy:
            block = re.sub(r'"Credit Card":\s*"[^"]+"', f'"Credit Card": "{cc_policy}"', block)
            block = re.sub(r'"App Loan":\s*"[^"]+"', f'"App Loan": "{app_policy}"', block)
            
    new_blocks.append(block)

# Rejoin
new_lenders_str = '  },\n'.join([b if b.startswith('  {') or i == 0 else b for i, b in enumerate(new_blocks)])
new_content = content[:match.start(1)] + new_lenders_str + content[match.end(1):]

with open(file_path, "w") as f:
    f.write(new_content)

print("Done updating policies.")
