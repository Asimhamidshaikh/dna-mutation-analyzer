// Codon Table mapping mRNA triplets to Amino Acids
const codonTable = {
  'AUG': 'Methionine (START)', 'UUU': 'Phenylalanine', 'UUC': 'Phenylalanine',
  'UUA': 'Leucine', 'UUG': 'Leucine', 'CUU': 'Leucine', 'CUC': 'Leucine',
  'CUA': 'Leucine', 'CUG': 'Leucine', 'AUU': 'Isoleucine', 'AUC': 'Isoleucine',
  'AUA': 'Isoleucine', 'GUU': 'Valine', 'GUC': 'Valine', 'GUA': 'Valine', 'GUG': 'Valine',
  'UCU': 'Serine', 'UCC': 'Serine', 'UCA': 'Serine', 'UCG': 'Serine',
  'CCU': 'Proline', 'CCC': 'Proline', 'CCA': 'Proline', 'CCG': 'Proline',
  'ACU': 'Threonine', 'ACC': 'Threonine', 'ACA': 'Threonine', 'ACG': 'Threonine',
  'GCU': 'Alanine', 'GCC': 'Alanine', 'GCA': 'Alanine', 'GCG': 'Alanine',
  'UAU': 'Tyrosine', 'UAC': 'Tyrosine', 'CAU': 'Histidine', 'CAC': 'Histidine',
  'CAA': 'Glutamine', 'CAG': 'Glutamine', 'AAU': 'Asparagine', 'AAC': 'Asparagine',
  'AAA': 'Lysine', 'AAG': 'Lysine', 'GAU': 'Aspartic Acid', 'GAC': 'Aspartic Acid',
  'GAA': 'Glutamic Acid', 'GAG': 'Glutamic Acid', 'UGU': 'Cysteine', 'UGC': 'Cysteine',
  'UGG': 'Tryptophan', 'CGU': 'Arginine', 'CGC': 'Arginine', 'CGA': 'Arginine',
  'CGG': 'Arginine', 'AGU': 'Serine', 'AGC': 'Serine', 'AGA': 'Arginine', 'AGG': 'Arginine',
  'GGU': 'Glycine', 'GGC': 'Glycine', 'GGA': 'Glycine', 'GGG': 'Glycine',
  'UAA': 'STOP', 'UAG': 'STOP', 'UGA': 'STOP'
};

// Transcribe DNA -> mRNA (Replace T with U)
function transcribe(dna) {
  return dna.replaceAll(/\s+/g, '').toUpperCase().replaceAll('T', 'U');
}

// Translate mRNA -> Amino Acid sequence
function translate(mrna) {
  let protein = [];
  for (let i = 0; i < mrna.length - 2; i += 3) {
    let codon = mrna.substring(i, i + 3);
    let aa = codonTable[codon] || 'Unknown';
    protein.push(aa);
    if (aa === 'STOP') break;
  }
  return protein;
}

// Compare two protein chains to identify mutations
function analyzeMutation(wildProtein, mutantProtein) {
  let differences = [];
  let maxLength = Math.max(wildProtein.length, mutantProtein.length);

  for (let i = 0; i < maxLength; i++) {
    if (wildProtein[i] !== mutantProtein[i]) {
      differences.push({
        position: i + 1,
        from: wildProtein[i] || 'None',
        to: mutantProtein[i] || 'None'
      });
    }
  }
  return differences;
}

// UI Event Listeners
document.getElementById('analyzeBtn').onclick = () => {
  const wildInput = document.getElementById('wildDNA').value;
  const mutantInput = document.getElementById('mutantDNA').value;

  const wildmRNA = transcribe(wildInput);
  const mutantmRNA = transcribe(mutantInput);

  const wildProtein = translate(wildmRNA);
  const mutantProtein = translate(mutantmRNA);

  document.getElementById('wildmRNA').textContent = wildmRNA;
  document.getElementById('wildProtein').textContent = wildProtein.join(' — ');

  document.getElementById('mutantmRNA').textContent = mutantmRNA;
  document.getElementById('mutantProtein').textContent = mutantProtein.join(' — ');

  const mutations = analyzeMutation(wildProtein, mutantProtein);
  const noticeBox = document.getElementById('mutationNotice');

  if (mutations.length > 0) {
    noticeBox.className = 'alert-box mutation';
    let details = mutations.map(m => `Position ${m.position}: Changed ${m.from} ➔ ${m.to}`).join('<br>');
    noticeBox.innerHTML = `⚠️ Point Mutation Detected!<br>${details}`;
  } else {
    noticeBox.className = 'alert-box normal';
    noticeBox.innerHTML = '✅ No amino acid alteration detected (Silent mutation or identical sequences).';
  }

  document.getElementById('resultsCard').classList.remove('hidden');
};

// Preset Dropdown Handler
document.getElementById('presetSelect').onchange = (e) => {
  if (e.target.value === 'sickleCell') {
    // Sickle cell substitution: GAG (Glutamic Acid) -> GTG (Valine)
    document.getElementById('wildDNA').value = 'ATG GTG CAC CTG ACT CCT GAG GAG';
    document.getElementById('mutantDNA').value = 'ATG GTG CAC CTG ACT CCT GTG GAG';
  }
};

