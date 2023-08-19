app.component('patient-selector', {
    props: {
        baseurl: {
            type: String,
            required: true,
        }
    },
    data: function() {
        return {
            action: '/patients',
            
            patients: [], // Array to store fetched patients
            selectedPatient: '',
            
            searchTermById: '',
            searchTermByFullName: '',
            searchTermByPhoneNumber: '',

            patientsByIdState: false,
            patientsByFullNameState: false,
            patientsByPhoneNumberState: false,

            isIdInputDisabled: false,
            isFullNameInputDisabled: false,
            isPhoneNumberInputDisabled: false,

            addNewPatientState: false,
        };
    },
    methods: {
        fetchPatients: async function() {
            try {
            const response = await axios.get(this.baseurl + this.action);

            // Processing patient data as needed
            this.patients = response.data;
            } catch (error) {
            console.error('Error fetching patients:', error);
            }
        },
        
        updatePatientsByIdState() {
            if (this.searchTermById == '') {
                this.patientsByIdState = false;

                // Update each input disabled state
                this.isFullNameInputDisabled = false;
                this.isPhoneNumberInputDisabled = false;

                return;
            }
            this.patientsByIdState = true;

            // Update each input disabled state
            this.isFullNameInputDisabled = true;
            this.isPhoneNumberInputDisabled = true;
        },
        updatePatientsByFullNameState() {
            if (this.searchTermByFullName == '') {
                this.patientsByFullNameState = false;

                // Update each input disabled state
                this.isIdInputDisabled = false;
                this.isPhoneNumberInputDisabled = false;

                return;
            }
            
            this.patientsByFullNameState = true;

            // Update each input disabled state
            this.isIdInputDisabled = true;
            this.isPhoneNumberInputDisabled = true;
        },
        updatePatientsByPhoneNumberState() {
            if (this.searchTermByPhoneNumber == '') {
                this.patientsByPhoneNumberState = false;

                // Update each input disabled state
                this.isIdInputDisabled = false;
                this.isFullNameInputDisabled = false;

                return;
            }

            this.patientsByPhoneNumberState = true;

            // Update each input disabled state
            this.isIdInputDisabled = true;
            this.isFullNameInputDisabled = true;
        },

        showNewPatientForm() {
          // Implement logic to show a form for adding a new patient
        //   this.showAddPatientForm = true;
        },
      },
      computed: {
        filteredPatientsById: function() {
            if (this.searchTermById === '') {
                return []; // Return an empty array when no search term is entered
            }
          
            const searchTerm = this.searchTermById;
            const filteredPatients = this.patients.filter(patient => {
              return patient.id.toString().includes(searchTerm.trim());
            });
          
            if (filteredPatients.length === 0) {
                this.addNewPatientState = true;
                return;
            }
          
            
            this.addNewPatientState = false;
            return filteredPatients; // Return the filtered array
        },          
        filteredPatientsByFullName: function() {
            if (this.searchTermByFullName === '') {
                return []; // Return an empty array when no search term is entered
            }

            const searchTerm = this.searchTermByFullName.toLowerCase();
            const filteredPatients =  this.patients.filter(patient => {
                return patient.full_name.toLowerCase().includes(searchTerm.trim());
            });

            if (filteredPatients.length === 0) {
                this.addNewPatientState = true;
                return;
            }
                      
            this.addNewPatientState = false;
            return filteredPatients; // Return the filtered array
        },
        filteredPatientsByPhoneNumber: function() {
            if (this.searchTermByPhoneNumber === '') {
                return []; // Return an empty array when no search term is entered
            }

            const searchTerm = this.searchTermByPhoneNumber;
            const filteredPatients =  this.patients.filter(patient => {
                return patient.phone_number.includes(searchTerm.trim());
            });

            if (filteredPatients.length === 0) {
                this.addNewPatientState = true;
                return;
            }
                      
            this.addNewPatientState = false;
            return filteredPatients; // Return the filtered array
        },
      },
      mounted() {
        this.fetchPatients(); // Fetch patients when component is mounted
      },

    template:
    /*html*/
    `
    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12">
            <h3>Patients List</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Birthday</th>
                        <th>Phone Number</th>
                        <th>Gender</th>                
                        <th>Note</th>                
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="patient in patients" :key="patient.id">
                        <td>{{ patient.id }}</td>
                        <td>{{ patient.full_name }}</td>
                        <td>{{ patient.birthday_date }}</td>
                        <td>{{ patient.phone_number }}</td>
                        <td>{{ patient.gender }}</td>
                        <td>{{ patient.note }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12">
            <h3>Select Patient</h3>
        </div>
        <div class="col-12">
            <select class="form-select" v-model="selectedPatient">
                <option value="">Select a patient</option>
                <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                    {{ patient.full_name }}
                </option>
            </select>
        </div>
    </div>

    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12">
            <h3>Search Patients</h3>
        </div>

        <div class="col-4">
            <label  class="form-label" for="patient-search-id">Search patient by "id":</label>
            <input class="form-control" v-model="searchTermById" v-on:input="updatePatientsByIdState" id="patient-search-id" v-bind:disabled="isIdInputDisabled" v-bind:placeholder="[ isIdInputDisabled ? 'Disabled input' : '']"/>     
        </div>

        <div class="col-4">
            <label  class="form-label" for="patient-search-name">Search patient by "full name":</label>
            <input class="form-control" v-model="searchTermByFullName" v-on:input="updatePatientsByFullNameState" id="patient-search-name" v-bind:disabled="isFullNameInputDisabled" v-bind:placeholder="[ isFullNameInputDisabled ? 'Disabled input' : '']"/>
        </div>

        <div class="col-4">
            <label  class="form-label" for="patient-search-phoneNumber">Search patient by "phone number":</label>
            <input class="form-control" v-model="searchTermByPhoneNumber" v-on:input="updatePatientsByPhoneNumberState" id="patient-search-phoneNumber" v-bind:disabled="isPhoneNumberInputDisabled" v-bind:placeholder="[ isPhoneNumberInputDisabled ? 'Disabled input' : '']"/>
        </div>

        <div class="col-12 mt-2" v-if="addNewPatientState">
            <div class="row">
                <div class="col-12">
                <p class="text-danger mt-2">
                    No patients match the search criteria. You can <u>add a new patient</u> if needed.
                </p>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <button v-on:click="showNewPatientForm" class="btn btn-primary">Add New Patient</button>
                </div>
            </div>

            <p style="display: none;"> 
                {{filteredPatientsById}}
                {{filteredPatientsByFullName}}
                {{filteredPatientsByPhoneNumber}}
            </p>
      </div>

      <div class="col-12 mt-4" v-else>
      <table class="table table-bordered" v-if="patientsByIdState || patientsByFullNameState || patientsByPhoneNumberState">
        <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Birthday</th>
                    <th>Phone Number</th>
                    <th>Gender</th>                
                    <th>Note</th>                
                </tr>
            </thead>
            <tbody>
                <tr v-if="patientsByIdState" v-for="patient in filteredPatientsById">
                    <td>{{ patient.id }}</td>
                    <td>{{ patient.full_name }}</td>
                    <td>{{ patient.birthday_date }}</td>
                    <td>{{ patient.phone_number }}</td>
                    <td>{{ patient.gender }}</td>
                    <td>{{ patient.note }}</td>
                </tr>
                <tr v-else-if="patientsByFullNameState" v-for="patient in filteredPatientsByFullName">
                    <td>{{ patient.id }}</td>
                    <td>{{ patient.full_name }}</td>
                    <td>{{ patient.birthday_date }}</td>
                    <td>{{ patient.phone_number }}</td>
                    <td>{{ patient.gender }}</td>
                    <td>{{ patient.note }}</td>
                </tr>
                <tr v-else v-for="patient in filteredPatientsByPhoneNumber">
                    <td>{{ patient.id }}</td>
                    <td>{{ patient.full_name }}</td>
                    <td>{{ patient.birthday_date }}</td>
                    <td>{{ patient.phone_number }}</td>
                    <td>{{ patient.gender }}</td>
                    <td>{{ patient.note }}</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    `,
})