const app = Vue.createApp({
    data: function() {
        return {
            backendBaseURL: 'http://127.0.0.1:8000',

            isPatientComponentVisible: true,
            isNewPatientFormComponentVisible: false,
            isDoctorComponentVisible: false,
            isTestComponentVisible: false,

            faCaretLeft: 'fa-caret-left',
            faCaretDown: 'fa-caret-down',

            newPatientId: 0,

            selectedPatient: '',
            selectedDoctor: '',
            selectedTests: {},
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
            this.selectedPatient = selectedPatient;
        },
        addToSelectedDoctor: function(selectedDoctor) {
            this.selectedDoctor = selectedDoctor;
        },
        addToSelectedTests: function(selectedTests) {
            const arrayWithDuplicates = selectedTests;
            const uniqueArray = arrayWithDuplicates.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });

            this.selectedTests = uniqueArray;
        },            
    },
})