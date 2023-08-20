const app = Vue.createApp({
    data: function() {
        return {
            backendBaseURL: 'http://127.0.0.1:8000',

            isPatientComponentVisible: true,
            isNewPatientFormComponentVisible: true,
            isDoctorComponentVisible: false,
            faCaretLeft: 'fa-caret-left',
            faCaretDown: 'fa-caret-down',

            newPatientId: 0,
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
        updateNewPatientFormComponentVisibilityState: function() {
            if (this.isNewPatientFormComponentVisible) {
                this.isNewPatientFormComponentVisible = false;
                return;
            }
            this.isNewPatientFormComponentVisible = true;
        },
        updateDoctorComponentVisibilityState: function() {
            if (this.isDoctorComponentVisible) {
                this.isDoctorComponentVisible = false;
                return;
            }
            this.isDoctorComponentVisible = true;
        },

        updateNewPatientId: function(id) {
            this.newPatientId = id;
        },
            
        // async updatePatient(patientId, patientData) {
        //     try {
        //     const response = await axios.put(`http://127.0.0.1:8000/patients/${patientId}`, patientData);
        //     console.log(response.data.message); // Success message
        //     } catch (error) {
        //     console.error('Error updating patient:', error);
        //     }
        // },
    
        // async deletePatient(patientId) {
        //     try {
        //     const response = await axios.delete(`http://127.0.0.1:8000/patients/${patientId}`);
        //     console.log(response.data.message); // Success message
        //     } catch (error) {
        //     console.error('Error deleting patient:', error);
        //     }
        // },
    },
})