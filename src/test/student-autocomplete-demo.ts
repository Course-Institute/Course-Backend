// Demo for Student Auto Complete API
// This demonstrates the getStudentAutoCompleteList endpoint

// API Endpoint: GET /api/students/getStudentAutoCompleteList

// Example requests:

// 1. Get all students (no query)
const getAllStudents = {
    url: "GET /api/students/getStudentAutoCompleteList",
    query: {}
};

// 2. Search by student name
const searchByName = {
    url: "GET /api/students/getStudentAutoCompleteList?query=rahul",
    query: { query: "rahul" }
};

// 3. Search by registration number
const searchByRegNo = {
    url: "GET /api/students/getStudentAutoCompleteList?query=123456780",
    query: { query: "123456780" }
};

// 4. Search by email
const searchByEmail = {
    url: "GET /api/students/getStudentAutoCompleteList?query=rahul@email.com",
    query: { query: "rahul@email.com" }
};

// 5. Search by course
const searchByCourse = {
    url: "GET /api/students/getStudentAutoCompleteList?query=BCA",
    query: { query: "BCA" }
};

// 6. Search by faculty
const searchByFaculty = {
    url: "GET /api/students/getStudentAutoCompleteList?query=Computer",
    query: { query: "Computer" }
};

// Expected Response Format:
const expectedResponse = {
    "status": true,
    "message": "Student list auto complete retrieved successfully",
    "data": [
        {
            "studentName": "Rahul Kumar",
            "studentId": "64f8a1b2c3d4e5f6a7b8c9d0"
        },
        {
            "studentName": "Rahul Sharma",
            "studentId": "64f8a1b2c3d4e5f6a7b8c9d1"
        },
        {
            "studentName": "Priya Rahul",
            "studentId": "64f8a1b2c3d4e5f6a7b8c9d2"
        }
    ]
};

console.log('Student Auto Complete API Demo');
console.log('================================');
console.log('Endpoint: GET /api/students/getStudentAutoCompleteList');
console.log('');
console.log('1. Get All Students:', JSON.stringify(getAllStudents, null, 2));
console.log('2. Search by Name:', JSON.stringify(searchByName, null, 2));
console.log('3. Search by Registration No:', JSON.stringify(searchByRegNo, null, 2));
console.log('4. Search by Email:', JSON.stringify(searchByEmail, null, 2));
console.log('5. Search by Course:', JSON.stringify(searchByCourse, null, 2));
console.log('6. Search by Faculty:', JSON.stringify(searchByFaculty, null, 2));
console.log('');
console.log('Expected Response:');
console.log(JSON.stringify(expectedResponse, null, 2));

// Search Capabilities:
console.log('');
console.log('Search Capabilities:');
console.log('- Search by student name (candidateName)');
console.log('- Search by registration number');
console.log('- Search by email address');
console.log('- Search by contact number');
console.log('- Search by course');
console.log('- Search by faculty');
console.log('- Case-insensitive search');
console.log('- Partial matching');
console.log('- Limited to 20 results');
console.log('- Returns only studentName and studentId');

// Frontend Usage Example:
console.log('');
console.log('Frontend Usage Example:');
console.log(`
// React component usage
const [students, setStudents] = useState([]);
const [loading, setLoading] = useState(false);

const searchStudents = async (query) => {
    setLoading(true);
    try {
        const response = await fetch(\`/api/students/getStudentAutoCompleteList?query=\${query}\`);
        const data = await response.json();
        setStudents(data.data);
    } catch (error) {
        console.error('Error searching students:', error);
    } finally {
        setLoading(false);
    }
};

// Usage in autocomplete component
<Autocomplete
    options={students}
    getOptionLabel={(option) => option.studentName}
    renderInput={(params) => (
        <TextField
            {...params}
            label="Select Student"
            placeholder="Search by name, registration, email..."
        />
    )}
    onChange={(event, value) => {
        if (value) {
            console.log('Selected student:', value.studentName, value.studentId);
        }
    }}
/>
`);
