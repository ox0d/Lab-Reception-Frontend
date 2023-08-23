app.component('test-selector', {
    props: {
        baseurl: {
            type: String,
            required: true,
        }
    },
    emits: ['selected-tests'],
    data: function() {
        return {
            testCategoriesAction: '/test-categories',
            testsAction: '/tests',

            testCategories: [], // Array to store fetched testCategories
            tests: [], // Array to store fetched tests

            selectedTests: [],

            categories: {},
        }
    },
    methods: {
        fetchTestCategories: async function() {
            try {
            const response = await axios.get(this.baseurl + this.testCategoriesAction);

            // Processing testCategories data as needed
            this.testCategories = response.data;

            } catch (error) {
                console.error('Error fetching testCategories:', error);
            }
        },

        fetchTests: async function() {
            try {
            const response = await axios.get(this.baseurl + this.testsAction);

            // Processing tests data as needed
            this.tests = response.data;
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        },

        toggleSelectAll: function(categoryName) {
        
            if (this.categories[categoryName]) {
              // If "Select All" is checked, add all test IDs within the category to selectedTests
              const categoryTests = this.tests.filter(test => test.test_category_id === this.testCategories.find(cat => cat.name === categoryName).id);
              this.selectedTests = [...this.selectedTests, ...categoryTests.map(test => test.id)];
            } else {
              // If "Select All" is unchecked, remove all test IDs from selectedTests within the category
              this.selectedTests = this.selectedTests.filter(testId => !this.tests.some(test => test.id === testId && test.test_category_id === this.testCategories.find(cat => cat.name === categoryName).id));
            }
        },
    },
    updated: function() {
        if (this.selectedTests.length == 0) {
            this.$emit('selected-tests', []);
            return;
        }
        this.$emit('selected-tests', this.selectedTests);
    },
    mounted: function() {
        this.fetchTestCategories(); // Fetch testCategories when component is mounted
        this.fetchTests(); // Fetch tests when component is mounted
    },
    template:
    /*html*/
    `
    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-md-12 col-lg-6 table-responsive" v-for="testCategorie in testCategories" v-bind:key="testCategorie.id">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th class="text-center" colspan="3">{{ testCategorie.name }}</th>
                    </tr>
                    <tr>
                        <th>ID</th>
                        <th>Test Name</th>
                        <th>Select</th>               
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="test in tests" v-bind:key="test.id">
                        <td v-if="test.test_category_id == testCategorie.id">{{test.id}}</td>
                        <td v-if="test.test_category_id == testCategorie.id">{{test.name}}</td>
                        <td v-if="test.test_category_id == testCategorie.id">
                            <input v-bind:id="test.name" class="form-check-input" type="checkbox" v-model="selectedTests" v-bind:value="test.id">
                        </td>
                    </tr>

                    <tr>
                        <td colspan="3" class="text-center">
                            <input v-bind:id="testCategorie.id" class="form-check-input" type="checkbox" v-model="categories[testCategorie.name]" @change="toggleSelectAll(testCategorie.name)">
                            Select All
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
});