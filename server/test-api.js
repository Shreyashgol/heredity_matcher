const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing Heredity API...\n');

    // 1. Add Grandpa
    console.log('1️⃣ Adding Grandpa (Mike)...');
    const grandpa = await axios.post(`${BASE_URL}/person`, {
      name: 'Mike (Grandpa)',
      birth_date: '1950-01-15',
      gender: 'Male'
    });
    const grandpaId = grandpa.data.data.id;
    console.log(`✅ Grandpa ID: ${grandpaId}\n`);

    // 2. Add Father
    console.log('2️⃣ Adding Father (John)...');
    const father = await axios.post(`${BASE_URL}/person`, {
      name: 'John (Father)',
      birth_date: '1975-05-20',
      gender: 'Male'
    });
    const fatherId = father.data.data.id;
    console.log(`✅ Father ID: ${fatherId}\n`);

    // 3. Add Son
    console.log('3️⃣ Adding Son (Alex)...');
    const son = await axios.post(`${BASE_URL}/person`, {
      name: 'Alex (Son)',
      birth_date: '2000-08-10',
      gender: 'Male'
    });
    const sonId = son.data.data.id;
    console.log(`✅ Son ID: ${sonId}\n`);

    // 4. Link Grandpa -> Father
    console.log('4️⃣ Linking Grandpa -> Father...');
    await axios.post(`${BASE_URL}/relationship`, {
      parent_id: grandpaId,
      child_id: fatherId,
      type: 'Father'
    });
    console.log('✅ Relationship created\n');

    // 5. Link Father -> Son
    console.log('5️⃣ Linking Father -> Son...');
    await axios.post(`${BASE_URL}/relationship`, {
      parent_id: fatherId,
      child_id: sonId,
      type: 'Father'
    });
    console.log('✅ Relationship created\n');

    // 6. Add Diabetes to Grandpa
    console.log('6️⃣ Adding Diabetes to Grandpa...');
    await axios.post(`${BASE_URL}/condition`, {
      person_id: grandpaId,
      condition_name: 'Diabetes',
      diagnosed_date: '2010-03-15'
    });
    console.log('✅ Condition added\n');

    // 7. Get Family Tree for Son
    console.log('7️⃣ Getting Family Tree for Son...');
    const tree = await axios.get(`${BASE_URL}/tree/${sonId}`);
    console.log(JSON.stringify(tree.data, null, 2));
    console.log('');

    // 8. Calculate Risk for Son
    console.log('8️⃣ Calculating Diabetes Risk for Son...');
    const risk = await axios.get(`${BASE_URL}/risk/${sonId}/Diabetes`);
    console.log(JSON.stringify(risk.data, null, 2));
    console.log('');

    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();
