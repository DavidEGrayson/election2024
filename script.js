// https://www.thebigquestions.com/2024/10/01/harriss-1922-paths-to-victory/
// https://www.archives.gov/electoral-college/allocation
const districts = [
  // 7 oft-cited battleground states:
  { code: 'PA', name: 'Pennsylvania', votes: 19, default: 'tossup' },
  { code: 'GA', name: 'Georgia', votes: 16, default: 'tossup' },
  { code: 'NC', name: 'North Carolina', votes: 16, default: 'tossup' },
  { code: 'MI', name: 'Michigan', votes: 15, default: 'tossup' },
  { code: 'AZ', name: 'Arizona', votes: 11, default: 'tossup' },
  { code: 'WI', name: 'Wisconsin', votes: 10, default: 'tossup' },
  { code: 'NV', name: 'Nevada', votes: 6, default: 'tossup' },

  // 10 more districts that appear to be at least barely contestable:
  { code: 'TX', name: 'Texas', votes: 40, default: 'rep?' },
  { code: 'FL', name: 'Florida', votes: 30, default: 'rep?' },
  { code: 'OH', name: 'Ohio', votes: 17, default: 'dem?' },
  { code: 'VA', name: 'Virginia', votes: 13, default: 'rep?' },
  { code: 'MN', name: 'Minnesota', votes: 10, default: 'dem?' },
  { code: 'NM', name: 'New Mexico', votes: 5, default: 'rep?' },
  { code: 'NH', name: 'New Hampshire', votes: 4, default: 'dem?' },
  { code: 'ME', name: 'Maine', votes: 2, default: 'dem?' },
  { code: 'ME-2', name: 'Maine 2', votes: 1, default: 'dem?' },
  { code: 'NE-2', name: 'Nebraska 2', votes: 1, default: 'rep?' },

  // Predictable districts
  { code: 'AL', name: 'Alabama', votes: 9, default: 'rep!' },
  { code: 'AK', name: 'Alaska', votes: 3, default: 'rep!' },
  { code: 'AR', name: 'Arkansas', votes: 6, default: 'rep!' },
  { code: 'CA', name: 'California', votes: 54, default: 'dem!' },
  { code: 'CO', name: 'Colorado', votes: 10, default: 'dem!' },
  { code: 'CT', name: 'Connecticut', votes: 7, default: 'dem!' },
  { code: 'DE', name: 'Delaware', votes: 3, default: 'dem!' },
  { code: 'DC', name: 'District of Columbia', votes: 3, default: 'dem!' },
  { code: 'HI', name: 'Hawaii', votes: 4, default: 'dem!' },
  { code: 'ID', name: 'Idaho', votes: 4, default: 'rep!' },
  { code: 'IL', name: 'Illinois', votes: 19, default: 'dem!' },
  { code: 'ID', name: 'Indiana', votes: 11, default: 'rep!' },
  { code: 'IA', name: 'Iowa', votes: 6, default: 'rep!' },
  { code: 'KS', name: 'Kansas', votes: 6, default: 'rep!' },
  { code: 'KY', name: 'Kentucy', votes: 8, default: 'rep!' },
  { code: 'LA', name: 'Louisiana', votes: 8, default: 'rep!' },
  { code: 'ME-1', name: 'Maine', votes: 1, default: 'dem!' },
  { code: 'MD', name: 'Maryland', votes: 10, default: 'dem!' },
  { code: 'MA', name: 'Massachusetts', votes: 11, default: 'dem!' },
  { code: 'MS', name: 'Mississippi', votes: 6, default: 'rep!' },
  { code: 'MO', name: 'Missouri', votes: 10, default: 'rep!' },
  { code: 'MT', name: 'Montana', votes: 4, default: 'rep!' },
  { code: 'NE', name: 'Nebraska', votes: 2, default: 'rep!' },
  { code: 'NE-1', name: 'Nebraska 1', votes: 1, default: 'rep!' },
  { code: 'NE-3', name: 'Nebraska 3', votes: 1, default: 'rep!' },
  { code: 'NJ', name: 'New Jersey', votes: 14, default: 'dem!' },
  { code: 'NY', name: 'New York', votes: 28, default: 'dem!' },
  { code: 'ND', name: 'North Dakota', votes: 3, default: 'rep!' },
  { code: 'OK', name: 'Oklahoma', votes: 7, default: 'rep!' },
  { code: 'OR', name: 'Oregon', votes: 8, default: 'dem!' },
  { code: 'RI', name: 'Rhode Island', votes: 4, default: 'dem!' },
  { code: 'SC', name: 'South Carolina', votes: 9, default: 'rep!' },
  { code: 'SD', name: 'South Dakota', votes: 3, default: 'rep!' },
  { code: 'TN', name: 'Tennessee', votes: 11, default: 'rep!' },
  { code: 'UT', name: 'Utah', votes: 6, default: 'rep!' },
  { code: 'VT', name: 'Vermont', votes: 3, default: 'dem!' },
  { code: 'WA', name: 'Washingtone', votes: 12, default: 'dem!' },
  { code: 'WV', name: 'West Virginia', votes: 4, default: 'rep!' },
  { code: 'WY', name: 'Wyoming', votes: 3, default: 'rep!' },
];

const district_map = {};
districts.forEach(d => { district_map[d.code] = d; })

const calls = {
  'tossup': { name: 'Toss-up', party: null, miracle_points: 0 },
  'rep?': { name: 'Republican (likely)', party: 'rep', miracle_points: 10 },
  'dem?': { name: 'Democrat (likely)', party: 'dem', miracle_points: 10 },
  'rep!': { name: 'Republican (100%)', party: 'rep', miracle_points: 100 },
  'dem!': { name: 'Democrat (100%)', party: 'dem', miracle_points: 100 },
}

var total_votes = 0;
for (let i = 0; i < districts.length; i++) {
  total_votes += districts[i]['votes'];
}
if (total_votes != 538) {
  window.alert("Incorrect data, total_votes = " + total_votes);
}

var votes_to_win = total_votes / 2 + 1

function populate_districts() {
  var districtsDiv = document.getElementById('districts');
  districts.forEach(district => {
    var districtDiv = document.createElement('div');
    var label = document.createElement('label');
    label.textContent = `${district.name} (${district.votes} votes): `;
    var select = document.createElement('select');
    select.dataset.code = district.code;
    Object.entries(calls).forEach(([code, call]) => {
      var option = document.createElement('option');
      option.value = code;
      option.textContent = call['name'];
      select.appendChild(option);
    });
    select.value = district['default']
    districtDiv.appendChild(label);
    districtDiv.appendChild(select);
    districtsDiv.appendChild(districtDiv);
  });
}

function calculatePaths() {
  const selectedParty = document.getElementById('party').value;
  const allDistricts = document.querySelectorAll('#districts select');
  const tossUpDistricts = [];

  let baseVotes = 0;
  let tossupVotes = 0;
  allDistricts.forEach(select => {
    const call = calls[select.value];
    console.log(select.dataset.code);
    const district = district_map[select.dataset.code];
    console.log(district);
    if (call.party == selectedParty) {
      baseVotes += district.votes;
    }
    else if (call.party == null) {
      tossupVotes += district.votes;
      tossUpDistricts.push(district);
    }
  });

  if (baseVotes >= votes_to_win) {
    window.alert("Candidate always wins"); // TODO
    displayPaths([]);
    return;
  }
  if (baseVotes + tossupVotes <= votes_to_win) {
    window.alert("No paths to victory (except maybe a tie)"); // TODO
    displayPaths([]);
    return;
  }

  const paths = findPaths(tossUpDistricts, votes_to_win - baseVotes);
  displayPaths(paths);
}

// Helper function to find minimal victory paths
function findPaths(tossUpDistricts, votesNeeded) {
    const paths = [];

    function dfs(path, remainingVotes, idx) {
        if (remainingVotes <= 0) {
            paths.push(path);
            return;
        }

        if (idx >= tossUpDistricts.length) return;

        dfs([...path, tossUpDistricts[idx].name], remainingVotes - tossUpDistricts[idx].votes, idx + 1);
        dfs(path, remainingVotes, idx + 1);
    }

    dfs([], votesNeeded, 0);

    // Filter out non-minimal paths
    return paths.filter(path => {
        return !paths.some(otherPath =>
            otherPath !== path && otherPath.every(district => path.includes(district))
        );
    });
}

// Function to display the calculated paths
function displayPaths(paths) {
    const victoryPathsList = document.getElementById('victoryPaths');
    victoryPathsList.innerHTML = '';

    if (paths.length === 0) {
        victoryPathsList.textContent = 'No toss-up districts needed. Candidate already has enough votes!';
    } else {
        paths.forEach(path => {
            const listItem = document.createElement('li');
            listItem.textContent = `Path: ${path.join(', ')}`;
            victoryPathsList.appendChild(listItem);
        });
    }
}

// Add event listener for the "Calculate" button
document.getElementById('calculate').addEventListener('click', calculatePaths);

// Populate districts on page load
populate_districts();
