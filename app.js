(function (){

    const root = document.documentElement;
    const fretboard = document.querySelector('.fretboard');

    const fretboardColors = {
        'C': 'crimson',
        'C#': 'chocolate',
        'Db': 'chocolate',
        'D': 'darkOrange',
        'D#': 'goldenRod',
        'Eb': 'goldenRod',
        'E': 'burlyWood',
        'F': 'green',
        'F#': 'forestGreen',
        'Gb': 'forestGreen',
        'G': 'LightSkyBlue',
        'G#': 'DodgerBlue',
        'Ab': 'DodgerBlue',
        'A': 'darkblue',
        'A#': 'magenta',
        'Bb': 'magenta',
        'B': 'blueViolet'
    };

    const instrumentSelector = document.querySelector('#instrument-selector');
    const accidentalSelector = document.querySelector('.accidental-selector');
    const numberOfFretsSelector = document.querySelector('#number-of-frets');
    const showAllNotesSelector = document.querySelector('#show-all-notes');
    const showMultipleNotesSelector = document.querySelector('#show-multiple-notes');
    const noteNameSection = document.querySelector('.note-name-section');
    const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
    const doubleFretMarkPositions = [12, 24];
    const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const instrumentTuningPresets = {
        'Guitar': [4, 11, 7, 2, 9, 4],
        'Bass (4 Strings)': [7, 2, 9, 4],
        'Bass (5 Strings)': [7, 2, 9, 4, 11],
        'Ukulele': [9, 4, 0, 7]
    };
    
    let allNotes;
    let showMultipleNotes = false;
    let showAllNotes = false;
    let numberOfFrets = 12;
    let accidentals = 'flats';
    let selectedInstrument = 'Guitar';
    let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
    
    const app = {
        init() {
            this.setupFretboard();
            this.setupSelectedInstrumentSelector();
            this.setupNoteNameSection();
            this.setupChordNameSection();
            handlers.setupEventListeners();
        },
        setupFretboard() {
            fretboard.innerHTML = '';
            root.style.setProperty("--number-of-strings", numberOfStrings);
            //  Add strings to fretboard
            for (let i = 0; i < numberOfStrings; i++) {
                let string = tools.createElement('div');
                string.classList.add('string');
                fretboard.appendChild(string);
    
                //  Create frets
                for (let fret = 0; fret <= numberOfFrets; fret++) {
                    let noteFret = tools.createElement('div');
                    noteFret.classList.add('note-fret');
                    string.appendChild(noteFret);
    
                    //  Create String Notes 
                    let { name: noteName, color: noteColor } = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals);
                    noteFret.setAttribute('data-note', noteName);
                    noteFret.style.setProperty('--noteDotColor', noteColor);
                       
                    //  Add single fret marks
                    if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                        noteFret.classList.add('single-fretmark');
                    }
                    //  Create double fret marks
                    if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
                        let doubleFretMark = tools.createElement('div');
                        doubleFretMark.classList.add('double-fretmark');
                        noteFret.appendChild(doubleFretMark);
                    }
                }
            }
            allNotes = document.querySelectorAll('.note-fret');
        },

        
        // CREATE NOTE NAMES 
        generateNoteNames(noteIndex, accidentals) {
            noteIndex = noteIndex % 12;
            if (noteIndex < 0) noteIndex += 12;
            let noteName, noteColor;
            if (accidentals === "flats") {
                noteName = notesFlat[noteIndex];
            } else if (accidentals === "sharps") {
                noteName = notesSharp[noteIndex];
            }
            noteColor = fretboardColors[noteName];
            return { name: noteName, color: noteColor };
        },
        
        // SELECT INSTRUMENT 
        setupSelectedInstrumentSelector() {
            for (instrument in instrumentTuningPresets) {
                let instrumentOption = tools.createElement('option', instrument);
                instrumentSelector.appendChild(instrumentOption);
            }
        },
        
        // NOTE NAME SECTION
        setupNoteNameSection() {
            noteNameSection.innerHTML = '';
            let noteNames;
            if (accidentals === 'flats') {
                noteNames = notesFlat;
            } else {
                noteNames = notesSharp;
            }
            noteNames.forEach((noteName) => {
                let noteNameElement = tools.createElement('span', noteName);
                noteNameSection.appendChild(noteNameElement);
            })
        },
        
        // CHORD NAME SECTION
        setupChordNameSection() {
            const chordNameSection = document.querySelector('.chord-name-section'); // Ensure you select the chord name section
            chordNameSection.innerHTML = '';
            const chordFormula = [0, 4, 7]; // Chord formula for major chords
           
            for (let i = 0; i < notesFlat.length; i++) {
                const chordNameElement = tools.createElement('div');
                const rootNote = notesFlat[i];
                const chordNotes = chordFormula.map(interval => (i + interval) % 12);
                const chordNoteNames = chordNotes.map(noteIndex => notesFlat[noteIndex]);
                chordNameElement.classList.add("chordDiv");
                
                chordNoteNames.forEach((note, index) => {
                    const noteSpan = document.createElement('span');
                    noteSpan.textContent = note;
                    const rootNoteColor = fretboardColors[rootNote];
                    noteSpan.style.color = rootNoteColor; // Set color for all notes in the chord
                    chordNameElement.appendChild(noteSpan);
                    if (index < chordNoteNames.length - 1) { // Add comma separator if not the last note
                        const commaSpan = document.createElement('span');
                        commaSpan.textContent = ' ';
                        chordNameElement.appendChild(commaSpan);
                    }
                });
                chordNameSection.appendChild(chordNameElement);
            }
        },
        
        
        
        
    }
    
    const handlers = {
            showNoteDot(event) {
            // Check if showAllNotes is selected
            if(showAllNotes) {
                return;
            }
            if (event.target.classList.contains('note-fret')) {
                if (showMultipleNotes) {
                    app.toggleMultipleNotes(event.target.dataset.note, 1)
                } else {
                    event.target.style.setProperty('--noteDotOpacity', 1)
                }
            }
        },
    
        hideNoteDot(event) {
            if(showAllNotes){
                return;
            }
            if (showMultipleNotes) {
                app.toggleMultipleNotes(event.target.dataset.note, 0)
            } else {
                event.target.style.setProperty('--noteDotOpacity', 0);
            }
        },
 
        setSelectedInstrument(event){
            selectedInstrument = event.target.value;
            numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
            app.setupFretboard();
        },
    
        setAccidentals(event){
            if (event.target.classList.contains('acc-select')) {
                accidentals = event.target.value;
                app.setupFretboard();
                app.setupNoteNameSection();
            } else {
                return;
            }
        },
    
        setNumberOfFrets(){
            numberOfFrets = numberOfFretsSelector.value;
            app.setupFretboard();
        },
    
        setShowAllNotes() {
            showAllNotes = showAllNotesSelector.checked;
            if (showAllNotes) {
                root.style.setProperty('--noteDotOpacity', 1);
                app.setupFretboard();
            } else {
                root.style.setProperty('--noteDotOpacity', 0);
                app.setupFretboard();
            }
        },
    
        setShowMultipleNotes(){
            showMultipleNotes = !showMultipleNotes;
        },
    
        setNotesToShow(event){
            let noteToShow = event.target.innerText;
            allNotes.forEach(noteFret => {
                if (noteFret.dataset.note === noteToShow) {
                    noteFret.style.setProperty('--noteDotOpacity', 1);
                }
            });
        },
        
        setNotesToHide(event){
            if (!showAllNotes){
                let noteToHide = event.target.innerText;
                allNotes.forEach(noteFret => {
                    if (noteFret.dataset.note === noteToHide) {
                        noteFret.style.setProperty('--noteDotOpacity', 0);
                    }
                });
            } else { 
                return;
            }
        }, 

        showChordNotes(event) {
            console.log("Mouse over chord name");
            const chordNotes = event.currentTarget.textContent.split(' ');
            // console.log("Chord notes:", chordNotes);
            chordNotes.forEach(note => {
                allNotes.forEach(noteFret => {
                    if (noteFret.dataset.note === note) {
                        noteFret.style.setProperty('--noteDotOpacity', 1);
                    }
                });
            });
        },
        
        hideChordNotes() {
            // console.log("Mouse out of chord name");
            allNotes.forEach(noteFret => {
                noteFret.style.setProperty('--noteDotOpacity', 0);
            });
        },
        
        
        setupEventListeners() {
            fretboard.addEventListener('mouseover',this.showNoteDot);
            fretboard.addEventListener('mouseout', this.hideNoteDot);
            instrumentSelector.addEventListener('change', this.setSelectedInstrument);
            accidentalSelector.addEventListener('click', this.setAccidentals);
            numberOfFretsSelector.addEventListener('change', this.setNumberOfFrets);
            showAllNotesSelector.addEventListener('change', this.setShowAllNotes);
            showMultipleNotesSelector.addEventListener('change', this.setShowMultipleNotes);
            noteNameSection.addEventListener('mouseover', this.setNotesToShow);
            noteNameSection.addEventListener('mouseout', this.setNotesToHide);
            
        }
    };
    const tools = {
        createElement(element, content) {
            element = document.createElement(element);
            if (arguments.length > 1) {
                element.innerHTML = content;
            }
            return element;
        }
    }
    
    // Calling the init method to initialize the app
    app.init();
})();
