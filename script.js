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
  { code: 'NE2', name: 'Nebraska 2', votes: 1, default: 'dem?' },
  { code: 'OH', name: 'Ohio', votes: 17, default: 'dem?' },
  { code: 'MN', name: 'Minnesota', votes: 10, default: 'dem?' },
  { code: 'NM', name: 'New Mexico', votes: 5, default: 'dem?' },
  { code: 'NH', name: 'New Hampshire', votes: 4, default: 'dem?' },
  { code: 'ME', name: 'Maine', votes: 2, default: 'dem?' },
  { code: 'ME2', name: 'Maine 2', votes: 1, default: 'dem?' },

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
  { code: 'NE1', name: 'Nebraska 1', votes: 1, default: 'rep!' },
  { code: 'NE3', name: 'Nebraska 3', votes: 1, default: 'rep!' },
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
  { code: 'ME1', name: 'Maine', votes: 1, default: 'dem!' },
  { code: 'MD', name: 'Maryland', votes: 10, default: 'dem!' },
  { code: 'MA', name: 'Massachusetts', votes: 11, default: 'dem!' },
  { code: 'NJ', name: 'New Jersey', votes: 14, default: 'dem!' },
  { code: 'NY', name: 'New York', votes: 28, default: 'dem!' },
  { code: 'OR', name: 'Oregon', votes: 8, default: 'dem!' },
  { code: 'RI', name: 'Rhode Island', votes: 4, default: 'dem!' },
  { code: 'VT', name: 'Vermont', votes: 3, default: 'dem!' },
  { code: 'WA', name: 'Washington', votes: 12, default: 'dem!' },
];

const path_count_limit = 10000

var total_votes = 0;
for (let i = 0; i < districts.length; i++) {
  total_votes += districts[i]['votes'];
}
if (total_votes != 538) {
  window.alert("Incorrect data, total_votes = " + total_votes);
}

const district_map = {};
districts.forEach(d => { district_map[d.code] = d; })

const calls = {
  'tossup': { name: 'Toss-up', party: null, miracle_points: 0 },
  'rep?': { name: 'Leans Republican', party: 'rep', miracle_points: 1 },
  'dem?': { name: 'Leans Democrat', party: 'dem', miracle_points: 1 },
  'rep!': { name: 'Likely Republican', party: 'rep', miracle_points: 100 },
  'dem!': { name: 'Likely Democrat', party: 'dem', miracle_points: 100 },
};

const party_name = {
  'rep': 'Republican',
  'dem': 'Democrat',
};

function populate_districts() {
  var table = document.getElementById('districts');
  districts.forEach(district => {
    var td_code = document.createElement('td');
    td_code.className = 'code';
    td_code.textContent = district.code;
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
      row.className = "predictable hidden";
    }
    row.appendChild(td_code);
    row.appendChild(td_name);
    row.appendChild(td_votes);
    row.appendChild(td_call);
    table.appendChild(row);
    district.dom_row = row
    district.dom_select = select
  });
}

var output_div = document.getElementById('output');

function output_clear() {
  output_div.innerHTML = "";  // clear the output
}

function output_str(obj) {
  var p = document.createElement('p');
  p.textContent = obj
  output_div.appendChild(p);
}

function output_paths(unsure_districts, paths) {
  function path_line(path) {
    var district_list = path.code_list;
    var line = '';
    var item;
    unsure_districts.forEach(district => {
      if (district_list.includes(district.code)) {  // calling includes could be slow
        item = district.code + " ";
      }
      else {
        item = "-";
      }
      item = item.padEnd(4, ' ')
      line += item;
    })
    item = '+' + path.votes;
    item = item.padStart(4, ' ')
    line += item;
    if (path.tie) { line += ' TIE' }
    line += '\n';
    return line
  }
  var text = paths.map(path_line).join('');
  var elem = document.createElement('pre');
  elem.textContent = text;
  output_div.appendChild(elem);
}

function output_scroll()
{
  document.getElementById("output").scrollIntoView({
    behavior: "smooth", // Optional: Makes the scroll smooth
    block: "start"      // Scrolls to the top of the element
  });
}

function calculate_path_stats(code_list) {
  var tie = false;
  if (code_list[code_list.length - 1] == 'TB') {
    code_list = code_list.slice(0, -1);
    tie = true;
  }

  votes = 0
  code_list.forEach(code => {
    votes += district_map[code].votes;
  });

  return { votes: votes, code_list: code_list, tie: tie }
}

function calculate_paths() {
  output_clear();

  const party = document.getElementById('party').value;

  var votes_to_win = total_votes / 2 + 1;

  var allow_rep_leans = document.getElementById('allow_rep_leans').checked;
  var allow_dem_leans = document.getElementById('allow_dem_leans').checked;
  var thresholds = {
    null: 0,
    'rep': allow_rep_leans ? 1 : 0,
    'dem': allow_dem_leans ? 1 : 0,
  };
  //var base_desc = thresholds[party] == 0 ? 'likely + leaning' : 'likely';

  var show_ties = document.getElementById('show_ties').checked;
  if ((total_votes % 2) == 1) { show_ties = false; }

  const unsure_districts = [];

  let base_votes = 0;
  let tossup_votes = 0;
  districts.forEach(district => {
    const call = calls[district_map[district.code].dom_select.value];
    if (call.miracle_points <= thresholds[call.party]) {
      tossup_votes += district.votes;
      unsure_districts.push(district);
    }
    else if (call.party == party) {
      base_votes += district.votes;
    }
  });

  // Avoid generating non-minimal paths by sorting our districts in
  // descending order by votes.
  unsure_districts.sort((d1, d2) => d2.votes - d1.votes);

  if (show_ties) {
    // Model the tiebreaking role of congress and/or unfaithful electors by
    // making them a district with one vote.
    unsure_districts.push({ code: 'TB', votes: 1 })
  }

  var sentence = "";
  if (base_votes >= votes_to_win) {
    output_str(`The ${party_name[party]} has ${base_votes} votes, which is enough to win!`);
    return;
  }
  if (base_votes + tossup_votes < votes_to_win) {
    output_str(`The ${party_name[party]} cannot get more than ${base_votes + tossup_votes} votes!`)
    return;
  }

  const votes_needed = votes_to_win - base_votes;
  var msg = `The ${party_name[party]} has ${base_votes} votes`;
  msg += ` and needs ${votes_needed} more to win`;
  if (show_ties) {
    msg += ` or ${votes_needed-1} more to tie`;
  }
  msg += '.';
  output_str(msg);

  var start = performance.now();

  // TODO: would be nice if the output above could be visible to the user
  // while we calculate the paths
  var paths = find_paths(unsure_districts, votes_needed);
  var ormore = (paths.length >= path_count_limit) ? ' or more' : '';
  output_str(`There are ${paths.length}${ormore} paths to get those votes.`)

  var duration = performance.now() - start;
  console.log("Path calculation time (ms): " + duration);

  paths = paths.map(calculate_path_stats)
  if (show_ties) {
    unsure_districts.pop()  // remove the TB district
  }

  start = performance.now();

  output_paths(unsure_districts, paths);

  var duration = performance.now() - start;
  console.log("Path output time (ms): " + duration);

  output_scroll();
}

function find_paths(unsure_districts, votes_needed) {
  const paths = [];

  function dfs(path, remaining_votes, index) {
    if (paths.length >= path_count_limit) { return; }

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

function update_district_visibility() {
  var show_all = document.getElementById('show_all').checked;
  console.log("udv")
  districts.forEach(district => {
    console.log(district.code)
    var show = show_all || !district.default.endsWith('!')
      || district.dom_select.value != district.default;
    district.dom_row.classList.toggle('hidden', !show);
  })
}

document.getElementById('calculate').addEventListener('click', calculate_paths);

document.getElementById('show_all').addEventListener('change', update_district_visibility);

populate_districts();
