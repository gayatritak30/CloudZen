
import re
import os

file_path = r'c:\Users\lalev\Downloads\CodeZen-main\CodeZen-main\lib\data.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find the test array for each course
# It looks for test: [ ... ]
# We want to find each occurrence and limit the items inside.

def limit_questions(match):
    test_content = match.group(1)
    # Split by }, which separates objects
    # Note: there might be nested objects but in this schema TestQuestion is simple.
    # Actually, let's use a more robust way to find individual questions.
    # Questions start with { and end with }
    
    questions = re.findall(r'\{\s*id:[\s\S]*?\}', test_content)
    
    if len(questions) > 10:
        limited_questions = questions[:10]
        # Join them back
        # We need to preserve some formatting if possible, but joining with },\n is a start.
        new_test_content = ',\n      '.join(limited_questions)
        return f'test: [\n      {new_test_content}\n    ],'
    return match.group(0)

# This regex might be too simple, let's refine it.
# We want to match: test: [ <anything> ],
# We use a non-greedy match for the content until the first ], that follows a }
new_content = re.sub(r'test:\s*\[([\s\S]*?)\]\s*,', limit_questions, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Processed and limited questions to 10 per course.")
