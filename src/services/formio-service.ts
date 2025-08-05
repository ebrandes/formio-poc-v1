import axios from 'axios';

const FORMIO_API_URL = import.meta.env.VITE_FORMIO_API_URL || 'http://localhost:3001';

export interface FormioForm {
  _id: string;
  title: string;
  name: string;
  path: string;
  display: string;
  type: string;
  tags?: string[];
  components?: any[];
  created?: string;
  modified?: string;
  machineName?: string;
}

class FormioService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = FORMIO_API_URL;
  }

  // Fetch all forms from Formio
  async getForms(): Promise<FormioForm[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/form`, {
        params: {
          type: 'form',
          limit: 100
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      // Return sample forms if API fails
      return this.getSampleForms();
    }
  }

  // Fetch a single form by path
  async getForm(path: string): Promise<FormioForm | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/${path}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      return null;
    }
  }

  // Submit form data
  async submitForm(formPath: string, data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/${formPath}/submission`, {
        data
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  }

  // Get sample forms for demo purposes
  private getSampleForms(): FormioForm[] {
    return [
      {
        _id: '1',
        title: 'Contact Form',
        name: 'contactForm',
        path: 'contact',
        display: 'form',
        type: 'form',
        tags: ['common'],
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'Customer Survey',
        name: 'surveyForm',
        path: 'survey',
        display: 'form',
        type: 'form',
        tags: ['survey'],
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      {
        _id: '3',
        title: 'User Registration',
        name: 'registrationForm',
        path: 'registration',
        display: 'wizard',
        type: 'form',
        tags: ['registration'],
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    ];
  }
}

export default new FormioService();