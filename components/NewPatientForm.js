app.component("new-patient-form", {
  props: {
    baseurl: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      action: "/patients",

      newPatient: {
        full_name: "",
        birthday_date: "",
        phone_number: "",
        gender: "",
        note: "",
      },

      toastMessage: "",

      formErrors: {
        full_name: "",
        birthday_date: "",
        phone_number: "",
        gender: "",
      },
    };
  },
  computed: {
    isFormInvalid() {
      return Object.values(this.formErrors).some((error) => error !== "");
    },
  },
  methods: {
    validateForm: function () {
      this.validateFullName();
      this.validateBirthdayDate();
      this.validatePhoneNumber();
      this.validateGender();
    },

    validateFullName: function () {
      this.formErrors.full_name = this.newPatient.full_name
        ? ""
        : "Full Name is required.";
      if (
        this.newPatient.full_name &&
        !/^[a-zA-Z\s]+$/.test(this.newPatient.full_name)
      ) {
        this.formErrors.full_name = "Invalid characters in Full Name.";
      }
    },

    validateBirthdayDate: function () {
      this.formErrors.birthday_date = this.newPatient.birthday_date
        ? ""
        : "Birthday Date is required.";
      if (
        this.newPatient.birthday_date &&
        !/^\d{4}-\d{2}-\d{2}$/.test(this.newPatient.birthday_date)
      ) {
        this.formErrors.birthday_date =
          "Invalid Birthday Date format. Use YYYY-MM-DD.";
      }
    },

    validatePhoneNumber: function () {
      this.formErrors.phone_number = this.newPatient.phone_number
        ? ""
        : "Phone Number is required.";
      if (
        this.newPatient.phone_number &&
        !/^[0-9]+$/.test(this.newPatient.phone_number)
      ) {
        this.formErrors.phone_number =
          "Phone Number should contain only digits.";
      }
    },

    validateGender: function () {
      this.formErrors.gender = this.newPatient.gender
        ? ""
        : "Gender is required.";
    },

    submitForm: async function () {
      this.validateForm();
      if (this.isFormInvalid) {
        // Display error messages to the user
        return;
      }

      try {
        const response = await axios.post(
          this.baseurl + this.action,
          this.newPatient
        );

        let responseObject = response.data;

        if (responseObject.message == "Patient created successfully") {
          // Automatically select the new patient in the Patient Selection dropdown
          this.$emit("patient-created", responseObject.id);

          // Clear the form fields
          this.newPatient = {
            full_name: "",
            birthday_date: "",
            phone_number: "",
            gender: "",
            note: "",
          };
          // Display success message to the user
          // console.log('Patient created successfully.');
          this.toastMessage = "Patient created successfully.";
          this.$emit("toast-message", this.toastMessage);
        } else {
          // Display error message to the user
          alert(responseObject.error);
        }
      } catch (error) {
        console.error(error);
        // Display error message to the user
        alert("An error occurred. Please try again later.");
      }
    },
  },
  template:
    /* html */
    `
    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
    <div class="col-12">
      <form @submit.prevent="submitForm" ref="form">
        <div class="row">
          <div class="col-12 col-sm-8 mb-3">
            <label for="full_name" class="form-label">Full Name</label>
            <input v-model="newPatient.full_name" type="text" class="form-control" id="full_name">
            <small class="text-danger">{{ formErrors.full_name }}</small>
          </div>
          <div class="col-12 col-sm-4 mb-3">
            <label for="birthday_date" class="form-label">Birthday Date</label>
            <input v-model="newPatient.birthday_date" type="date" class="form-control" id="birthday_date">
            <small class="text-danger">{{ formErrors.birthday_date }}</small>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12 col-sm-8 mb-3">
            <label for="phone_number" class="form-label">Phone Number</label>
            <input v-model="newPatient.phone_number" type="tel" class="form-control" id="phone_number">
            <small class="text-danger">{{ formErrors.phone_number }}</small>
          </div>
          <div class="col-12 col-sm-4 mb-3">
            <label for="gender" class="form-label">Gender</label>
            <select v-model="newPatient.gender" class="form-select" id="gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <small class="text-danger">{{ formErrors.gender }}</small>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <label for="note" class="form-label">Note</label>
            <textarea v-model="newPatient.note" class="form-control" id="note" rows="3"></textarea>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </form>
    </div>
  </div>

    `,
});
