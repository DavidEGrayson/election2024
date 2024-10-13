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
  { code: 'VA', name: 'Virginia', votes: 13, default: 'rep?' },
  { code: 'NE-2', name: 'Nebraska 2', votes: 1, default: 'dem?' },
  { code: 'OH', name: 'Ohio', votes: 17, default: 'dem?' },
  { code: 'MN', name: 'Minnesota', votes: 10, default: 'dem?' },
  { code: 'NM', name: 'New Mexico', votes: 5, default: 'dem?' },
  { code: 'NH', name: 'New Hampshire', votes: 4, default: 'dem?' },
  { code: 'ME', name: 'Maine', votes: 2, default: 'dem?' },
  { code: 'ME-2', name: 'Maine 2', votes: 1, default: 'dem?' },

  // Predictable districts
  { code: 'AL', name: 'Alabama', votes: 9, default: 'rep!' },
  { code: 'AK', name: 'Alaska', votes: 3, default: 'rep!' },
  { code: 'AR', name: 'Arkansas', votes: 6, default: 'rep!' },
  { code: 'ID', name: 'Idaho', votes: 4, default: 'rep!' },
  { code: 'ID', name: 'Indiana', votes: 11, default: 'rep!' },
  { code: 'IA', name: 'Iowa', votes: 6, default: 'rep!' },
  { code: 'KS', name: 'Kansas', votes: 6, default: 'rep!' },
  { code: 'KY', name: 'Kentucy', votes: 8, default: 'rep!' },
  { code: 'LA', name: 'Louisiana', votes: 8, default: 'rep!' },
  { code: 'MS', name: 'Mississippi', votes: 6, default: 'rep!' },
  { code: 'MO', name: 'Missouri', votes: 10, default: 'rep!' },
  { code: 'MT', name: 'Montana', votes: 4, default: 'rep!' },
  { code: 'NE', name: 'Nebraska', votes: 2, default: 'rep!' },
  { code: 'NE-1', name: 'Nebraska 1', votes: 1, default: 'rep!' },
  { code: 'NE-3', name: 'Nebraska 3', votes: 1, default: 'rep!' },
  { code: 'ND', name: 'North Dakota', votes: 3, default: 'rep!' },
  { code: 'OK', name: 'Oklahoma', votes: 7, default: 'rep!' },
  { code: 'SC', name: 'South Carolina', votes: 9, default: 'rep!' },
  { code: 'SD', name: 'South Dakota', votes: 3, default: 'rep!' },
  { code: 'TN', name: 'Tennessee', votes: 11, default: 'rep!' },
  { code: 'UT', name: 'Utah', votes: 6, default: 'rep!' },
  { code: 'WV', name: 'West Virginia', votes: 4, default: 'rep!' },
  { code: 'WY', name: 'Wyoming', votes: 3, default: 'rep!' },
  { code: 'CA', name: 'California', votes: 54, default: 'dem!' },
  { code: 'CO', name: 'Colorado', votes: 10, default: 'dem!' },
  { code: 'CT', name: 'Connecticut', votes: 7, default: 'dem!' },
  { code: 'DE', name: 'Delaware', votes: 3, default: 'dem!' },
  { code: 'DC', name: 'District of Columbia', votes: 3, default: 'dem!' },
  { code: 'HI', name: 'Hawaii', votes: 4, default: 'dem!' },
  { code: 'IL', name: 'Illinois', votes: 19, default: 'dem!' },
  { code: 'ME-1', name: 'Maine', votes: 1, default: 'dem!' },
  { code: 'MD', name: 'Maryland', votes: 10, default: 'dem!' },
  { code: 'MA', name: 'Massachusetts', votes: 11, default: 'dem!' },
  { code: 'NJ', name: 'New Jersey', votes: 14, default: 'dem!' },
  { code: 'NY', name: 'New York', votes: 28, default: 'dem!' },
  { code: 'OR', name: 'Oregon', votes: 8, default: 'dem!' },
  { code: 'RI', name: 'Rhode Island', votes: 4, default: 'dem!' },
  { code: 'VT', name: 'Vermont', votes: 3, default: 'dem!' },
  { code: 'WA', name: 'Washingtone', votes: 12, default: 'dem!' },
];

const district_map = {};
districts.forEach(d => { district_map[d.code] = d; })

const district_select_map = {};

const calls = {
  'tossup': { name: 'Toss-up', party: null, miracle_points: 0 },
  'rep?': { name: 'Republican (leans)', party: 'rep', miracle_points: 10 },
  'dem?': { name: 'Democrat (leans)', party: 'dem', miracle_points: 10 },
  'rep!': { name: 'Republican (likely)', party: 'rep', miracle_points: 100 },
  'dem!': { name: 'Democrat (likely)', party: 'dem', miracle_points: 100 },
};

const party_name = {
  'rep': 'Republican',
  'dem': 'Democrat',
};

var total_votes = 0;
for (let i = 0; i < districts.length; i++) {
  total_votes += districts[i]['votes'];
}
if (total_votes != 538) {
  window.alert("Incorrect data, total_votes = " + total_votes);
}

function populate_districts() {
  var table = document.getElementById('districts');
  districts.forEach(district => {
    var td_name = document.createElement('td');
    td_name.className = 'name';
    td_name.textContent = district.name;
    var td_votes = document.createElement('td');
    td_votes.className = 'votes';
    td_votes.textContent = district.votes;
    var select = document.createElement('select');
    select.className = 'call';
    select.dataset.code = district.code;
    Object.entries(calls).forEach(([code, call]) => {
      var option = document.createElement('option');
      option.value = code;
      option.textContent = call['name'];
      select.appendChild(option);
    });
    var call_code = district['default'];
    select.value = call_code;
    var call = calls[call_code];
    var td_call = document.createElement('td');
    td_call.className = 'select';
    td_call.appendChild(select);
    var row = document.createElement('tr');
    if (call.miracle_points > 50) {
      row.className = "likely";
    }
    row.appendChild(td_name);
    row.appendChild(td_votes);
    row.appendChild(td_call);
    table.appendChild(row);
    district_select_map[district.code] = select
  });
}

var output_div = document.getElementById('output');

function output_clear() {
  output_div.textContent = "";  // clear the output
}

function output_str(obj) {
  var p = document.createElement('p');
  p.textContent = obj
  output_div.appendChild(p);
}

function output_paths(unsure_districts, paths) {
  var table = document.createElement('table');
  table.className = "paths";
  paths.forEach(path => {
    console.log(path)
    var row = document.createElement('tr');
    row.className = "path";
    unsure_districts.forEach(district => {
      var td = document.createElement('td');
      console.log(district.code)
      if (path.includes(district.code)) {  // calling includes could be slow
        td.textContent = district.code;
      }
      else {
        td.textContent = "-";
      }
      row.appendChild(td);
    })
    table.appendChild(row);
  });
  output_div.appendChild(table);
}

// TODO: calculate possibilities of a tie somewhere
function calculate_paths() {

  const party = document.getElementById('party').value;

  var votes_to_win = total_votes / 2 + 1;

  const unsure_districts = [];

  let base_votes = 0;
  let tossup_votes = 0;
  districts.forEach(district => {
    const call = calls[district_select_map[district.code].value];
    if (call.party == party) {
      base_votes += district.votes;
    }
    else if (call.party == null) {
      tossup_votes += district.votes;
      unsure_districts.push(district);
    }
  });

  // Avoid generating non-minimal paths by sorting our districts in
  // descending order by votes.
  unsure_districts.sort((d1, d2) => d2.votes - d1.votes);

  var sentence = "";
  if (base_votes >= votes_to_win) {
    output_str(`The ${party_name[party]} wins with at least ${base_votes} votes.`);
    return;
  }
  if (base_votes + tossup_votes <= votes_to_win) {
    output_str(`The ${party_name[party]} loses with at most ${base_votes + tossup_votes} votes.`)
    return;
  }

  const votes_needed = votes_to_win - base_votes;
  const paths = find_paths(unsure_districts, votes_needed);
  output_str(`The ${party_name[party]} needs ${votes_needed} votes.`)
  output_paths(unsure_districts, paths);
}

function find_paths(unsure_districts, votes_needed) {
  const paths = [];

  function dfs(path, remaining_votes, index) {
    if (remaining_votes <= 0) {
      paths.push(path);
      return;
    }

    if (index >= unsure_districts.length) return;

    dfs([...path, unsure_districts[index].code],
      remaining_votes - unsure_districts[index].votes, index + 1);
    dfs(path, remaining_votes, index + 1);
  }

  dfs([], votes_needed, 0);

  return paths;
}

document.getElementById('calculate').addEventListener('click', calculate_paths);

document.getElementById('show_all').addEventListener('change', function() {
  document.body.classList.toggle('show_all', this.checked);
});

// Populate districts on page load
populate_districts();
