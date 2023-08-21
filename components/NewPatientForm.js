app.component('new-patient-form', {
    props: {
        baseurl: {
            type: String,
            required: true,
        }
    },
    data: function() {
        return {
            action: '/patients',

            newPatient: {
                full_name: '',
                birthday_date: '',
                phone_number: '',
                gender: '',
                note: ''
            },

            toastMessage: '',
        };
    },
    methods: {
        submitForm: async function() {
            try {
                const response = await axios.post(this.baseurl + this.action, this.newPatient);

                let responseObject = response.data;

                if (responseObject.message == 'Patient created successfully') {
                    // Automatically select the new patient in the Patient Selection dropdown
                    this.$emit('patient-created', responseObject.id);
                    
                    // Clear the form fields
                    this.newPatient = {
                    full_name: '',
                    birthday_date: '',
                    phone_number: '',
                    gender: '',
                    note: ''
                    };
                    // Display success message to the user
                    // console.log('Patient created successfully.');
                    this.toastMessage = 'Patient created successfully.';
                    this.$emit('toast-message', this.toastMessage);
                    
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
    },
    template:
    /* html */
    `
    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12">
            <form @submit.prevent="submitForm">
                <div class="row">
                    <div class="col-sm-12 col-md-8 mb-3">
                        <label for="full_name" class="form-label">Full Name</label>
                        <input v-model="newPatient.full_name" type="text" class="form-control" id="full_name" required>
                    </div>
                    <div class="col-sm-12 col-md-4 mb-3">
                        <label for="birthday_date" class="form-label">Birthday Date</label>
                        <input v-model="newPatient.birthday_date" type="date" class="form-control" id="birthday_date" required>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-sm-12 col-md-8 mb-3">
                        <label for="phone_number" class="form-label">Phone Number</label>
                        <input v-model="newPatient.phone_number" type="tel" class="form-control" id="phone_number" required>
                    </div>
                    <div class="col-sm-12 col-md-4 mb-3">
                        <label for="gender" class="form-label">Gender</label>
                        <select v-model="newPatient.gender" class="form-select" id="gender" required>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class="mb-3">
                        <label for="note" class="form-label">Note</label>
                        <textarea v-model="newPatient.note" class="form-control" id="note" rows="3"></textarea>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary">Submit</button>    

            </form>
        </div>
    </div>

    `,
})