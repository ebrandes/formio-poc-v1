#!/bin/bash

# Script to create sample forms in Formio with authentication
# Usage: ./create-forms-authenticated.sh

FORMIO_URL="http://localhost:3001"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="CHANGEME"

echo "========================================"
echo "Formio Form Creator with Authentication"
echo "========================================"
echo ""

# Step 1: Login and get token
echo "1. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$FORMIO_URL/admin/login/submission" \
  -H "Content-Type: application/json" \
  -d "{\"data\": {\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\", \"submit\": true}, \"metadata\": {\"timezone\": \"America/Sao_Paulo\", \"offset\": -180, \"origin\": \"$FORMIO_URL\", \"referrer\": \"\", \"browserName\": \"Netscape\", \"userAgent\": \"Mozilla/5.0\", \"pathName\": \"/\", \"onLine\": true}, \"state\": \"submitted\"}" \
  -D -)

# Extract token from response headers
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -i "x-jwt-token" | cut -d' ' -f2 | tr -d '\r')

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to login. Please check credentials."
  echo "   Email: $ADMIN_EMAIL"
  echo "   Password: $ADMIN_PASSWORD"
  exit 1
fi

echo "✅ Successfully logged in!"
echo ""

# Step 2: Create forms with authentication
echo "2. Creating sample forms..."
echo ""

# Example Form 1
echo -n "Creating Example Form 1... "
curl -s -X POST "$FORMIO_URL/form" \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: $TOKEN" \
  -d '{
    "title": "Example Form 1",
    "name": "example1",
    "path": "example1",
    "type": "form",
    "display": "form",
    "tags": ["example", "demo"],
    "components": [
      {
        "label": "Name",
        "tableView": true,
        "validate": {"required": true},
        "key": "name",
        "type": "textfield",
        "input": true,
        "placeholder": "Enter your name"
      },
      {
        "label": "Age",
        "key": "age",
        "type": "number",
        "input": true,
        "validate": {"min": 1, "max": 120}
      },
      {
        "label": "Favorite Color",
        "widget": "choicesjs",
        "tableView": true,
        "data": {
          "values": [
            {"label": "Red", "value": "red"},
            {"label": "Blue", "value": "blue"},
            {"label": "Green", "value": "green"},
            {"label": "Yellow", "value": "yellow"}
          ]
        },
        "key": "favoriteColor",
        "type": "select",
        "input": true
      },
      {
        "label": "Submit",
        "showValidations": false,
        "theme": "primary",
        "key": "submit",
        "type": "button",
        "input": true
      }
    ]
  }' > /dev/null 2>&1 && echo "✅ Done" || echo "⚠️  May already exist"

# Example Form 2
echo -n "Creating Example Form 2... "
curl -s -X POST "$FORMIO_URL/form" \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: $TOKEN" \
  -d '{
    "title": "Example Form 2",
    "name": "example2",
    "path": "example2",
    "type": "form",
    "display": "form",
    "tags": ["example", "demo"],
    "components": [
      {
        "label": "Company Name",
        "tableView": true,
        "validate": {"required": true},
        "key": "companyName",
        "type": "textfield",
        "input": true
      },
      {
        "label": "Number of Employees",
        "widget": "choicesjs",
        "tableView": true,
        "data": {
          "values": [
            {"label": "1-10", "value": "1-10"},
            {"label": "11-50", "value": "11-50"},
            {"label": "51-200", "value": "51-200"},
            {"label": "201-500", "value": "201-500"},
            {"label": "500+", "value": "500+"}
          ]
        },
        "key": "numberOfEmployees",
        "type": "select",
        "input": true
      },
      {
        "label": "Description",
        "key": "description",
        "type": "textarea",
        "input": true,
        "rows": 3
      },
      {
        "label": "Submit",
        "theme": "primary",
        "key": "submit",
        "type": "button",
        "input": true
      }
    ]
  }' > /dev/null 2>&1 && echo "✅ Done" || echo "⚠️  May already exist"

# Contact Form
echo -n "Creating Contact Form... "
curl -s -X POST "$FORMIO_URL/form" \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: $TOKEN" \
  -d '{
    "title": "Contact Form",
    "name": "contact",
    "path": "contact",
    "type": "form",
    "display": "form",
    "tags": ["contact"],
    "components": [
      {
        "label": "Name",
        "key": "name",
        "type": "textfield",
        "input": true,
        "validate": {"required": true}
      },
      {
        "label": "Email",
        "key": "email",
        "type": "email",
        "input": true,
        "validate": {"required": true}
      },
      {
        "label": "Message",
        "key": "message",
        "type": "textarea",
        "input": true,
        "validate": {"required": true}
      },
      {
        "label": "Submit",
        "key": "submit",
        "type": "button",
        "input": true
      }
    ]
  }' > /dev/null 2>&1 && echo "✅ Done" || echo "⚠️  May already exist"

echo ""
echo "========================================"
echo "✅ Form creation complete!"
echo "========================================"
echo ""
echo "Available forms:"
echo "- Example Form 1: $FORMIO_URL/example1"
echo "- Example Form 2: $FORMIO_URL/example2"  
echo "- Contact Form: $FORMIO_URL/contact"
echo ""
echo "View in Forms Gallery: http://localhost:5173/"
echo "Manage in Formio Admin: $FORMIO_URL"