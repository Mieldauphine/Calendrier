const calendarDiv = document.getElementById('calendar');
const currentMonthDisplay = document.getElementById('current-month');
const dayTypeSelector = document.getElementById('day-type');
const deplacementDetails = document.getElementById('deplacement-details');
const deplacementTypeInput = document.getElementById('deplacement-type');
const deplacementLieuInput = document.getElementById('deplacement-lieu');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const resetCalendarButton = document.getElementById('reset-calendar');

const countResidence = document.getElementById('count-residence');
const countDeplacement = document.getElementById('count-deplacement');
const countConge = document.getElementById('count-conge');
const countSamediDeplacement = document.getElementById('count-samedi-deplacement');

let currentYear = 2025;
let currentMonth = 0;

// Charger les données depuis le localStorage
let calendarData = JSON.parse(localStorage.getItem('calendarData')) || {};

// Mettre à jour l'affichage du mois
function updateMonthDisplay() {
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    currentMonthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
}

// Générer le calendrier
function generateCalendar(year, month) {
    calendarDiv.innerHTML = '';
    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    // Ajouter les jours de la semaine
    daysOfWeek.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('day');
        calendarDiv.appendChild(dayDiv);
    });

    const date = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const firstDay = (date.getDay() + 6) % 7;

    // Cases vides avant le début du mois
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarDiv.appendChild(emptyDiv);
    }

    // Ajouter les jours du mois
    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;

        const key = `${year}-${month}-${i}`;
        if (calendarData[key]) {
            dayDiv.classList.add(calendarData[key].type);
            if (calendarData[key].type === 'deplacement') {
                dayDiv.setAttribute(
                    'title',
                    `Déplacement : ${calendarData[key].details.type} à ${calendarData[key].details.lieu}`
                );
            }
        }

        dayDiv.addEventListener('click', () => setDayType(dayDiv, key));
        calendarDiv.appendChild(dayDiv);
    }

    updateSummary();
}

// Appliquer un type de jour et sauvegarder
function setDayType(dayDiv, key) {
    const selectedType = dayTypeSelector.value;

    dayDiv.classList.remove('residence', 'deplacement', 'conge');

    if (selectedType === 'deplacement') {
        deplacementDetails.style.display = 'block';
    } else {
        deplacementDetails.style.display = 'none';
    }

    if (selectedType) {
        const details =
            selectedType === 'deplacement'
                ? {
                      type: deplacementTypeInput.value || 'Non précisé',
                      lieu: deplacementLieuInput.value || 'Non précisé',
                  }
                : null;

        calendarData[key] = { type: selectedType, details };
        dayDiv.classList.add(selectedType);

        if (selectedType === 'deplacement') {
            dayDiv.setAttribute(
                'title',
                `Déplacement : ${details.type} à ${details.lieu}`
            );
        }
    } else {
        delete calendarData[key];
    }

    localStorage.setItem('calendarData', JSON.stringify(calendarData));
    updateSummary();
}

// Mettre à jour les compteurs
function updateSummary() {
    let residenceCount = 0;
    let deplacementCount = 0;
    let congeCount = 0;
    let samediDeplacementCount = 0;

    Object.keys(calendarData).forEach(key => {
        const { type } = calendarData[key];
        const [year, month, day] = key.split('-').map(Number);
        const date = new Date(year, month, day);

        if (type === 'residence') residenceCount++;
        if (type === 'deplacement') {
            deplacementCount++;
            if (date.getDay() === 6) samediDeplacementCount++; // 6 = Samedi
        }
        if (type === 'conge') congeCount++;
    });

    countResidence.textContent = residenceCount;
    countDeplacement.textContent = deplacementCount;
    countConge.textContent = congeCount;
    countSamediDeplacement.textContent = samediDeplacementCount;
}

// Réinitialiser le calendrier
resetCalendarButton.addEventListener('click', () => {
    if (confirm('Voulez-vous vraiment réinitialiser le calendrier ?')) {
        calendarData = {};
        localStorage.removeItem('calendarData');
        generateCalendar(currentYear, currentMonth);
    }
});

// Gestion des mois précédent/suivant
prevMonthButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateMonthDisplay();
    generateCalendar(currentYear, currentMonth);
});

nextMonthButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateMonthDisplay();
    generateCalendar(currentYear, currentMonth);
});

// Initialisation
updateMonthDisplay();
generateCalendar(current
