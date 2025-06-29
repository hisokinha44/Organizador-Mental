document.addEventListener('DOMContentLoaded', function () {
    const sectionsContainer = document.getElementById('sectionsContainer');
    const emptyState = document.getElementById('emptyState');
    const newSectionBtn = document.getElementById('newSectionBtn');
    const emptyStateBtn = document.getElementById('emptyStateBtn');
    const newSectionModal = document.getElementById('newSectionModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelSectionBtn = document.getElementById('cancelSectionBtn');
    const saveSectionBtn = document.getElementById('saveSectionBtn');
    const sectionTitleInput = document.getElementById('sectionTitleInput');
    const newSubsectionModal = document.getElementById('newSubsectionModal');
    const closeSubsectionModalBtn = document.getElementById('closeSubsectionModalBtn');
    const cancelSubsectionBtn = document.getElementById('cancelSubsectionBtn');
    const saveSubsectionBtn = document.getElementById('saveSubsectionBtn');
    const subsectionTitleInput = document.getElementById('subsectionTitleInput');

    let sections = JSON.parse(localStorage.getItem('mentalOrganizerSections')) || [];
    let currentSectionId = null;

    function init() {
        renderSections();
        updateEmptyState();
    }

    function renderSections() {
        sectionsContainer.innerHTML = '';

        sections.forEach(section => {
            const sectionElement = createSectionElement(section);
            sectionsContainer.appendChild(sectionElement);
        });
    }

    function createSectionElement(section) {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'section-container bg-gray-800 rounded-lg p-4 border border-gray-700';
        sectionElement.dataset.sectionId = section.id;

        sectionElement.innerHTML = `
                    <div class="flex justify-between items-center mb-3">
                        <h2 class="text-lg font-semibold text-blue-400">${section.title}</h2>
                        <div class="flex space-x-2">
                            <button class="add-subsection-btn text-blue-500 hover:text-blue-400 p-1" data-section-id="${section.id}">
                                <i class="fas fa-plus-circle"></i>
                            </button>
                            <button class="delete-section-btn text-red-500 hover:text-red-400 p-1" data-section-id="${section.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="subsections-container space-y-3" data-section-id="${section.id}">
                        ${section.subsections.map(subsection => createSubsectionHTML(subsection)).join('')}
                    </div>
                `;

        return sectionElement;
    }

    function createSubsectionHTML(subsection) {
        return `
                    <div class="subsection bg-gray-700 rounded-lg p-3 border border-gray-600" data-subsection-id="${subsection.id}">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-medium text-gray-200">${subsection.title}</h3>
                            <button class="delete-subsection-btn text-red-500 hover:text-red-400 p-1" data-subsection-id="${subsection.id}">
                                <i class="fas fa-trash text-sm"></i>
                            </button>
                        </div>
                        <textarea class="subsection-content w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-blue-500" data-subsection-id="${subsection.id}" placeholder="Write your notes here...">${subsection.content || ''}</textarea>
                    </div>
                `;
    }

    function updateEmptyState() {
        if (sections.length === 0) {
            emptyState.classList.remove('hidden');
            sectionsContainer.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            sectionsContainer.classList.remove('hidden');
        }
    }

    function saveSections() {
        localStorage.setItem('mentalOrganizerSections', JSON.stringify(sections));
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    newSectionBtn.addEventListener('click', () => {
        sectionTitleInput.value = '';
        newSectionModal.classList.remove('hidden');
        sectionTitleInput.focus();
    });

    emptyStateBtn.addEventListener('click', () => {
        sectionTitleInput.value = '';
        newSectionModal.classList.remove('hidden');
        sectionTitleInput.focus();
    });

    closeModalBtn.addEventListener('click', () => {
        newSectionModal.classList.add('hidden');
    });

    cancelSectionBtn.addEventListener('click', () => {
        newSectionModal.classList.add('hidden');
    });

    saveSectionBtn.addEventListener('click', () => {
        const title = sectionTitleInput.value.trim();
        if (title) {
            const newSection = {
                id: generateId(),
                title: title,
                subsections: []
            };
            sections.push(newSection);
            saveSections();
            renderSections();
            updateEmptyState();
            newSectionModal.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-subsection-btn')) {
            const sectionId = e.target.closest('.add-subsection-btn').dataset.sectionId;
            currentSectionId = sectionId;
            subsectionTitleInput.value = '';
            newSubsectionModal.classList.remove('hidden');
            subsectionTitleInput.focus();
        }
    });

    closeSubsectionModalBtn.addEventListener('click', () => {
        newSubsectionModal.classList.add('hidden');
    });

    cancelSubsectionBtn.addEventListener('click', () => {
        newSubsectionModal.classList.add('hidden');
    });

    saveSubsectionBtn.addEventListener('click', () => {
        const title = subsectionTitleInput.value.trim();
        if (title && currentSectionId) {
            const section = sections.find(s => s.id === currentSectionId);
            if (section) {
                const newSubsection = {
                    id: generateId(),
                    title: title,
                    content: ''
                };
                section.subsections.push(newSubsection);
                saveSections();
                renderSections();
                newSubsectionModal.classList.add('hidden');
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.delete-section-btn')) {
            const sectionId = e.target.closest('.delete-section-btn').dataset.sectionId;
            if (confirm('Are you sure you want to delete this section and all its subsections?')) {
                sections = sections.filter(s => s.id !== sectionId);
                saveSections();
                renderSections();
                updateEmptyState();
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.delete-subsection-btn')) {
            const subsectionId = e.target.closest('.delete-subsection-btn').dataset.subsectionId;
            if (confirm('Are you sure you want to delete this subsection?')) {
                sections.forEach(section => {
                    section.subsections = section.subsections.filter(sub => sub.id !== subsectionId);
                });
                saveSections();
                renderSections();
            }
        }
    });

    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('subsection-content')) {
            const subsectionId = e.target.dataset.subsectionId;
            const content = e.target.value;

            sections.forEach(section => {
                const subsection = section.subsections.find(sub => sub.id === subsectionId);
                if (subsection) {
                    subsection.content = content;
                }
            });

            saveSections();
        }
    });

    init();
});