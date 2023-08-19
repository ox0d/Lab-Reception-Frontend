const app = Vue.createApp({
    data: function() {
        return {
            backendBaseURL: 'http://127.0.0.1:8000',

            isPatientComponentVisible: true,
            faCaretLeft: 'fa-caret-left',
            faCaretDown: 'fa-caret-down',
        };
    },
    methods: {
        updatePatientComponentVisibilityState: function() {
            if (this.isPatientComponentVisible) {
                this.isPatientComponentVisible = false;
                return;
            }
            this.isPatientComponentVisible = true;
        },

        fetchPatients: async function() {
            try {
            const response = await axios.get('http://127.0.0.1:8000/patients');
            const patients = response.data;
            // Process the patient data as needed
            console.log(patients);
            } catch (error) {
            console.error('Error fetching patients:', error);
            }
        },
    
        async createPatient(patientData) {
            try {
            const response = await axios.post('http://127.0.0.1:8000/patients', patientData);
            console.log(response.data.message); // Success message
            } catch (error) {
            console.error('Error creating patient:', error);
            }
        },
    
        async updatePatient(patientId, patientData) {
            try {
            const response = await axios.put(`http://127.0.0.1:8000/patients/${patientId}`, patientData);
            console.log(response.data.message); // Success message
            } catch (error) {
            console.error('Error updating patient:', error);
            }
        },
    
        async deletePatient(patientId) {
            try {
            const response = await axios.delete(`http://127.0.0.1:8000/patients/${patientId}`);
            console.log(response.data.message); // Success message
            } catch (error) {
            console.error('Error deleting patient:', error);
            }
        },
    },
})