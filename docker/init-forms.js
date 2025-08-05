const axios = require('axios');
const fs = require('fs');
const path = require('path');

const FORMIO_API_URL = process.env.FORMIO_API_URL || 'http://formio-ce:3001';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CHANGEME';

// Wait for Formio to be ready
async function waitForFormio(maxRetries = 60, delay = 2000) {
  console.log('Waiting for Formio to be ready...');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1}/${maxRetries}: Checking Formio...`);
      
      // Try to access the main page
      const response = await axios.get(FORMIO_API_URL, {
        timeout: 5000,
        validateStatus: function (status) {
          // Accept any status code as "ready"
          return status < 500;
        }
      });
      
      if (response.status === 200 || response.status === 404 || response.status === 401) {
        console.log('✅ Formio is ready!');
        return true;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`Formio not ready yet (connection refused). Waiting ${delay}ms...`);
      } else {
        console.log(`Formio check error: ${error.message}. Waiting ${delay}ms...`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  throw new Error('Formio did not become ready in time');
}

// Wait for admin user to be created
async function waitForAdminUser(maxRetries = 10, delay = 3000) {
  console.log('Waiting for admin user to be created...');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Try to login using the correct endpoint
      const response = await axios.post(
        `${FORMIO_API_URL}/admin/login/submission`,
        {
          data: {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            submit: true
          },
          metadata: {
            timezone: "America/Sao_Paulo",
            offset: -180,
            origin: FORMIO_API_URL,
            referrer: "",
            browserName: "Netscape",
            userAgent: "Mozilla/5.0 (formio-init)",
            pathName: "/",
            onLine: true
          },
          state: "submitted"
        },
        {
          validateStatus: function (status) {
            return status < 500;
          }
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        const token = response.headers['x-jwt-token'];
        if (token) {
          console.log('✅ Admin user is ready and logged in!');
          return token;
        }
      }
    } catch (error) {
      console.log(`Admin login attempt ${i + 1}/${maxRetries} failed. Waiting ${delay}ms...`);
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  console.log('⚠️  Could not login as admin. Forms will be created without authentication.');
  return null;
}

// Create sample forms
async function createSampleForms(token) {
  console.log('Loading sample forms...');
  
  // Read sample forms from JSON file
  const sampleFormsPath = path.join(__dirname, 'sample-forms.json');
  const sampleForms = JSON.parse(fs.readFileSync(sampleFormsPath, 'utf8'));
  
  console.log(`Found ${sampleForms.length} forms to create`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const form of sampleForms) {
    try {
      console.log(`\nCreating form: ${form.title} (${form.path})`);
      
      // Prepare headers with token if available
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['x-jwt-token'] = token;
      }
      
      // Create the form
      const response = await axios.post(
        `${FORMIO_API_URL}/form`,
        form,
        {
          headers,
          validateStatus: function (status) {
            return status < 500;
          }
        }
      );
      
      if (response.status === 201 || response.status === 200) {
        console.log(`✅ Form "${form.title}" created successfully!`);
        successCount++;
      } else if (response.status === 400 || response.status === 409) {
        console.log(`⚠️  Form "${form.title}" already exists, skipping.`);
        skipCount++;
      } else if (response.status === 401 || response.status === 403) {
        console.log(`⚠️  Not authorized to create form "${form.title}".`);
        errorCount++;
      } else {
        console.log(`❌ Unexpected response for form "${form.title}": ${response.status}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error creating form "${form.title}":`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n==============================================');
  console.log('Form Creation Summary:');
  console.log(`✅ Created: ${successCount}`);
  console.log(`⚠️  Skipped: ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('==============================================');
}

// Main initialization function
async function initialize() {
  try {
    console.log('');
    console.log('==============================================');
    console.log('Starting Formio Form Initialization');
    console.log('==============================================');
    console.log(`API URL: ${FORMIO_API_URL}`);
    console.log(`Admin Email: ${ADMIN_EMAIL}`);
    console.log('');
    
    // Step 1: Wait for Formio to be ready
    await waitForFormio();
    
    // Step 2: Give Formio time to initialize
    console.log('Waiting for Formio to fully initialize...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 3: Try to login as admin
    const token = await waitForAdminUser();
    
    // Step 4: Create sample forms
    await createSampleForms(token);
    
    console.log('');
    console.log('==============================================');
    console.log('✅ Initialization Complete!');
    console.log('==============================================');
    console.log('');
    console.log('Available endpoints:');
    console.log(`- Formio Admin: http://localhost:3001`);
    console.log(`- React App: http://localhost:5173`);
    console.log('');
    console.log('Sample forms (if created):');
    console.log('- Example Form 1: /example1');
    console.log('- Example Form 2: /example2');
    console.log('- Contact Form: /contact');
    console.log('- Survey Form: /survey');
    console.log('- Registration Form: /registration');
    console.log('');
    
    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('==============================================');
    console.error('❌ Initialization Failed');
    console.error('==============================================');
    console.error('Error:', error.message);
    console.error('');
    console.error('You can manually create forms at http://localhost:3001');
    console.error('Or run: ./create-sample-forms.sh');
    console.error('');
    
    // Exit with error
    process.exit(1);
  }
}

// Run initialization
initialize();