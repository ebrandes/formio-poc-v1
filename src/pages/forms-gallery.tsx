import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import FormioForm from "../formio-components/formio-form/formio-form";
import formioService, { FormioForm as FormioFormType } from "../services/formio-service";

const FormsGallery = () => {
  const [forms, setForms] = useState<FormioFormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormioFormType | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedForms = await formioService.getForms();
      setForms(fetchedForms);
    } catch (err) {
      setError("Failed to load forms. Using sample forms instead.");
      console.error("Error loading forms:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFormIcon = (form: FormioFormType) => {
    // Assign icons based on form name or tags
    if (form.name?.includes('contact') || form.tags?.includes('contact')) return 'pi pi-envelope';
    if (form.name?.includes('survey') || form.tags?.includes('survey')) return 'pi pi-chart-bar';
    if (form.name?.includes('registration') || form.tags?.includes('registration')) return 'pi pi-user-plus';
    if (form.display === 'wizard') return 'pi pi-forward';
    return 'pi pi-file-edit';
  };

  const getFormCategory = (form: FormioFormType) => {
    // Categorize based on tags or form type
    if (form.tags?.includes('common')) return 'Common';
    if (form.tags?.includes('survey')) return 'Feedback';
    if (form.tags?.includes('registration')) return 'Authentication';
    if (form.display === 'wizard') return 'Wizard';
    return 'General';
  };

  const getFormDifficulty = (form: FormioFormType) => {
    // Estimate difficulty based on form structure
    if (form.display === 'wizard') return 'advanced';
    if (form.components && form.components.length > 10) return 'medium';
    return 'easy';
  };

  const handleFormSelect = (form: FormioFormType) => {
    setSelectedForm(form);
    setShowDialog(true);
    setSubmittedData(null);
    setActiveTab(0);
  };

  const handleFormSubmit = async (submission: any) => {
    console.log("Form submitted:", submission);
    setSubmittedData(submission.data);
    setActiveTab(1); // Switch to submission data tab
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "advanced":
        return "danger";
      default:
        return "info";
    }
  };

  const dialogFooter = (
    <div className="flex justify-end gap-2">
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={() => setShowDialog(false)}
        className="p-button-text"
      />
      {submittedData && (
        <Button
          label="Clear Data"
          icon="pi pi-refresh"
          onClick={() => {
            setSubmittedData(null);
            setActiveTab(0);
          }}
          className="p-button-warning"
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ProgressSpinner />
          <p className="mt-4 text-lg">Loading forms from Formio server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <i className="pi pi-file-edit mr-2"></i>
          Formio Forms Gallery
        </h1>
        <p className="text-gray-600">
          Browse and test forms from your Formio server. These forms are loaded directly from {import.meta.env.VITE_FORMIO_API_URL || "http://localhost:3001"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Message severity="warn" text={error} className="mb-4" />
      )}

      {/* Refresh Button */}
      <div className="mb-4 flex justify-end">
        <Button
          label="Refresh Forms"
          icon="pi pi-refresh"
          onClick={loadForms}
          className="p-button-outlined"
        />
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <Card className="text-center">
          <i className="pi pi-inbox text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">No Forms Found</h3>
          <p className="text-gray-600 mb-4">
            No forms are available in your Formio server yet.
          </p>
          <Button
            label="Open Formio Admin"
            icon="pi pi-external-link"
            onClick={() => window.open("http://localhost:3001", "_blank")}
            className="p-button-primary"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Card
              key={form._id}
              className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleFormSelect(form)}
            >
              <div className="flex flex-col h-full">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className={`${getFormIcon(form)} text-2xl text-blue-600`}></i>
                    <h3 className="text-xl font-semibold">{form.title || form.name}</h3>
                  </div>
                  <Badge 
                    value={getFormDifficulty(form)} 
                    severity={getDifficultyColor(getFormDifficulty(form))}
                  />
                </div>

                {/* Category */}
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Category: </span>
                  <span className="text-sm font-medium">{getFormCategory(form)}</span>
                </div>

                {/* Path */}
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Path: </span>
                  <code className="text-sm bg-gray-100 px-1 rounded">{form.path}</code>
                </div>

                {/* Display Type */}
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Type: </span>
                  <span className="text-sm font-medium capitalize">{form.display || 'form'}</span>
                </div>

                {/* Action Button */}
                <Button
                  label="Open Form"
                  icon="pi pi-external-link"
                  className="w-full mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFormSelect(form);
                  }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Custom Form Card */}
      <div className="mt-6">
        <Card className="bg-gray-50">
          <div className="flex items-center gap-4">
            <i className="pi pi-info-circle text-3xl text-blue-500"></i>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-1">Create New Forms</h3>
              <p className="text-gray-600">
                Access the Formio Admin Portal at{" "}
                <a 
                  href="http://localhost:3001" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  http://localhost:3001
                </a>
                {" "}to create and manage forms using the visual form builder.
                <br />
                <span className="text-sm">
                  Login: <code>admin@example.com</code> / Password: <code>CHANGEME</code>
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog
        header={
          <div className="flex items-center gap-2">
            <i className={selectedForm ? getFormIcon(selectedForm) : 'pi pi-file-edit'}></i>
            <span>{selectedForm?.title || selectedForm?.name}</span>
          </div>
        }
        visible={showDialog}
        style={{ width: "90vw", maxWidth: "800px" }}
        onHide={() => setShowDialog(false)}
        footer={dialogFooter}
        maximizable
        modal
      >
        {selectedForm && (
          <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
            <TabPanel header="Form" leftIcon="pi pi-file-edit mr-2">
              <div className="p-2">
                <FormioForm
                  formKey={selectedForm.path}
                  onSubmit={handleFormSubmit}
                />
              </div>
            </TabPanel>
            
            <TabPanel 
              header="Submission Data" 
              leftIcon="pi pi-database mr-2"
              disabled={!submittedData}
            >
              {submittedData ? (
                <div className="p-4">
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded">
                    <i className="pi pi-check-circle text-green-600 mr-2"></i>
                    <span className="text-green-800 font-medium">
                      Form submitted successfully!
                    </span>
                  </div>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(submittedData, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <i className="pi pi-inbox text-4xl mb-2"></i>
                  <p>No submission data yet. Complete and submit the form to see the data here.</p>
                </div>
              )}
            </TabPanel>

            <TabPanel header="Form Info" leftIcon="pi pi-info-circle mr-2">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Form Details</h4>
                    <ul className="space-y-2">
                      <li>
                        <span className="text-gray-600">ID:</span>{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {selectedForm._id}
                        </code>
                      </li>
                      <li>
                        <span className="text-gray-600">Path:</span>{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          {selectedForm.path}
                        </code>
                      </li>
                      <li>
                        <span className="text-gray-600">Category:</span>{" "}
                        <span className="font-medium">{getFormCategory(selectedForm)}</span>
                      </li>
                      <li>
                        <span className="text-gray-600">Display:</span>{" "}
                        <span className="font-medium capitalize">{selectedForm.display || 'form'}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">API Endpoint</h4>
                    <div className="bg-gray-100 p-3 rounded mb-2">
                      <code className="text-sm break-all">
                        {`${import.meta.env.VITE_FORMIO_API_URL || "http://localhost:3001"}/${selectedForm.path}`}
                      </code>
                    </div>
                    {selectedForm.created && (
                      <p className="text-sm text-gray-600">
                        Created: {new Date(selectedForm.created).toLocaleDateString()}
                      </p>
                    )}
                    {selectedForm.modified && (
                      <p className="text-sm text-gray-600">
                        Modified: {new Date(selectedForm.modified).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        )}
      </Dialog>
    </div>
  );
};

export default FormsGallery;