const app = Vue.createApp({
    data: function() {
        return {
            backendBaseURL: 'http://127.0.0.1:8000',

            action: '/barcode-generation',

            isPatientComponentVisible: false,
            isNewPatientFormComponentVisible: false,
            isDoctorComponentVisible: false,
            isTestComponentVisible: false,

            faCaretLeft: 'fa-caret-left',
            faCaretDown: 'fa-caret-down',

            newPatientId: 0,

            selectedPatient: '',
            selectedDoctor: '',
            selectedTests: {},

            newAppointment: {
                patient_id: '',
                doctor_id: '',
                test_ids: [],
                barcode: 'OGE568',
            },

            toastMessage: '',
        };
    },
    methods: {

        submitForm: async function() {
            try {
                const response = await axios.post(this.backendBaseURL + this.action, this.newAppointment);

                let responseObject = response.data;

                console.log(responseObject);

                if (responseObject.message == 'Appointment scheduled successfully') {
                    
                    // Clear newAppointment data
                    this.newAppointment.patient_id = '';
                    this.newAppointment.doctor_id = '';
                    this.newAppointment.test_ids = [];
                    this.newAppointment.barcode = 'OGE568';

                    // Display success message to the user
                    // console.log('Appointment scheduled successfully.');
                    this.toastMessage = 'Appointment scheduled successfully.';

                    // Handle the toast display
                    var toast = new bootstrap.Toast(document.querySelector('.toast'));
                    toast.show();

                } else {
                    // Display error message to the user
                    alert(responseObject.error);
                }
            } catch (error) {
                console.error(error);
                // Display error message to the user
                alert('An error occurred. Please try again later.');
            }
        },

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
        updateTestComponentVisibilityState: function() {
            if (this.isTestComponentVisible) {
                this.isTestComponentVisible = false;
                return;
            }
            this.isTestComponentVisible = true;
        },

        updateNewPatientId: function(id) {
            this.newPatientId = id;
        },

        addToSelectedPatient: function(selectedPatient) {
            this.newAppointment.patient_id = selectedPatient;
        },
        addToSelectedDoctor: function(selectedDoctor) {
            this.newAppointment.doctor_id = selectedDoctor;
        },
        addToSelectedTests: function(selectedTests) {
            const arrayWithDuplicates = selectedTests;
            const uniqueArray = arrayWithDuplicates.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });

            this.newAppointment.test_ids = uniqueArray;
        }, 
        
        updateToastMessage: function(toastMessage) {
            this.toastMessage = toastMessage;

            // Handle the toast display
            var toast = new bootstrap.Toast(document.querySelector('.toast'));
            toast.show();
        }
    },
})