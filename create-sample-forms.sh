#!/bin/bash

# Script to create sample forms in Formio
# Usage: ./create-sample-forms.sh

FORMIO_URL="http://localhost:3001"

echo "Creating sample forms in Formio..."
echo "================================"

# Example Form 1
curl -X POST "$FORMIO_URL/form" \
  -H "Content-Type: application/json" \
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
        "mask": false,
        "tableView": false,
        "validate": {"min": 1, "max": 120},
        "key": "age",
        "type": "number",
        "input": true
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
        "tableView": false,
        "key": "submit",
        "type": "button",
        "input": true
      }
    ]
  }' 2>/dev/null

echo "✅ Created Example Form 1"

# Example Form 2
curl -X POST "$FORMIO_URL/form" \
  -H "Content-Type: application/json" \
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
        "validate": {"required": true},
        "key": "numberOfEmployees",
        "type": "select",
        "input": true
      },
      {
        "label": "Industry",
        "widget": "choicesjs",
        "tableView": true,
        "data": {
          "values": [
            {"label": "Technology", "value": "technology"},
            {"label": "Healthcare", "value": "healthcare"},
            {"label": "Finance", "value": "finance"},
            {"label": "Education", "value": "education"},
            {"label": "Retail", "value": "retail"},
            {"label": "Other", "value": "other"}
          ]
        },
        "key": "industry",
        "type": "select",
        "input": true
      },
      {
        "label": "Description",
        "autoExpand": false,
        "tableView": true,
        "key": "description",
        "type": "textarea",
        "input": true,
        "rows": 3,
        "placeholder": "Tell us about your company..."
      },
      {
        "label": "Interested in Partnership",
        "tableView": false,
        "key": "interestedInPartnership",
        "type": "checkbox",
        "input": true,
        "defaultValue": false
      },
      {
        "label": "Submit",
        "showValidations": false,
        "theme": "primary",
        "tableView": false,
        "key": "submit",
        "type": "button",
        "input": true
      }
    ]
  }' 2>/dev/null

echo "✅ Created Example Form 2"

# Simple Contact Form
curl -X POST "$FORMIO_URL/form" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Simple Contact",
    "name": "simplecontact",
    "path": "simplecontact",
    "type": "form",
    "display": "form",
    "tags": ["contact", "demo"],
    "components": [
      {
        "label": "Full Name",
        "tableView": true,
        "validate": {"required": true},
        "key": "fullName",
        "type": "textfield",
        "input": true
      },
      {
        "label": "Email",
        "tableView": true,
        "validate": {"required": true},
        "key": "email",
        "type": "email",
        "input": true
      },
      {
        "label": "Message",
        "tableView": true,
        "validate": {"required": true},
        "key": "message",
        "type": "textarea",
        "rows": 4,
        "input": true
      },
      {
        "label": "Submit",
        "theme": "primary",
        "key": "submit",
        "type": "button",
        "input": true
      }
    ]
  }' 2>/dev/null

echo "✅ Created Simple Contact Form"

echo ""
echo "================================"
echo "✅ Sample forms created successfully!"
echo ""
echo "Available forms:"
echo "- Example Form 1: $FORMIO_URL/example1"
echo "- Example Form 2: $FORMIO_URL/example2"
echo "- Simple Contact: $FORMIO_URL/simplecontact"
echo ""
echo "You can view and test these forms in the Forms Gallery at http://localhost:5173/"
echo "Click 'Refresh Forms' button to see the new forms."