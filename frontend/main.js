import Students from './API/students/index.js';

// Создание столбца с данными студента
function getStudentItem(studentObj) {
  const {
    id,
    name,
    surname,
    lastname,
    birthday,
    studyStart,
    faculty,
  } = studentObj;

  const listItem = document.createElement('tr');
  const listItemId = document.createElement('td');
  const listItemName = document.createElement('td');
  const listItemFaculty = document.createElement('td');
  const listItemBirthday = document.createElement('td');
  const listItemYearCommencement = document.createElement('td');
  const listItemButtons = document.createElement('td');

  const listItemDelete = document.createElement('button');
  const listItemUpdate = document.createElement('button');

  listItem.setAttribute('data-id', id);
  listItemId.textContent = id;
  listItemName.textContent = `${surname} ${name} ${lastname}`;
  listItemFaculty.textContent = faculty;
  listItemBirthday.textContent = new Date(birthday).toLocaleDateString();
  listItemYearCommencement.textContent = `${studyStart}-${+studyStart + 4}`;

  listItemUpdate.textContent = 'Изменить';
  listItemDelete.textContent = 'Удалить';

  listItemUpdate.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2');
  listItemUpdate.setAttribute('data-bs-toggle', 'modal');
  listItemUpdate.setAttribute('data-bs-target', '#updateStudent');
  listItemDelete.classList.add('btn', 'btn-sm', 'btn-danger');

  listItemUpdate.addEventListener('click', () => {
    const updateStudentForm = document.querySelector('.modal-form-update');

    const inputName = document.querySelector('#update-student-name');
    const inputSurname = document.querySelector('#update-student-surname');
    const inputLastname = document.querySelector('#update-student-lastname');
    const inputBirthday = document.querySelector('#update-student-birthday');
    const inputYearStudy = document.querySelector('#update-student-yearStudy');
    const inputFaculty = document.querySelector('#update-student-faculty');

    updateStudentForm.setAttribute('data-id', id);

    inputName.value = name;
    inputSurname.value = surname;
    inputLastname.value = lastname;
    inputBirthday.valueAsDate = new Date(birthday);
    inputYearStudy.value = studyStart;
    inputFaculty.value = faculty;
  });
  listItemDelete.addEventListener('click', () => {
    const students = new Students();
    students.delete(id);
  });

  listItemButtons.append(
    listItemUpdate,
    listItemDelete,
  );

  listItem.append(
    listItemId,
    listItemName,
    listItemFaculty,
    listItemBirthday,
    listItemYearCommencement,
    listItemButtons,
  );

  return listItem;
}

// Рендер списка студентов
async function renderStudentsTable(studentsArray) {
  const copyStudentsArray = await studentsArray;
  const list = document.querySelector('.list');
  list.textContent = '';

  return copyStudentsArray.forEach((student) => {
    list.append(getStudentItem(student));
  });
}

// Создание нового студента
function createStudent() {
  const inputName = document.querySelector('#create-student-name');
  const inputSurname = document.querySelector('#create-student-surname');
  const inputLastname = document.querySelector('#create-student-lastname');
  const inputBirthday = document.querySelector('#create-student-birthday');
  const inputYearStudy = document.querySelector('#create-student-yearStudy');
  const inputFaculty = document.querySelector('#create-student-faculty');

  const data = {
    name: inputName.value.trim(),
    surname: inputSurname.value.trim(),
    lastname: inputLastname.value.trim(),
    birthday: inputBirthday.valueAsDate,
    studyStart: +inputYearStudy.value.trim(),
    faculty: inputFaculty.value.trim(),
  };

  new Students().create(data);

  inputName.value = '';
  inputSurname.value = '';
  inputLastname.value = '';
  inputBirthday.value = '';
  inputYearStudy.value = '';
  inputFaculty.value = '';
}

// Изменение студента
function updateStudent(id) {
  const inputName = document.querySelector('#update-student-name');
  const inputSurname = document.querySelector('#update-student-surname');
  const inputLastname = document.querySelector('#update-student-lastname');
  const inputBirthday = document.querySelector('#update-student-birthday');
  const inputYearStudy = document.querySelector('#update-student-yearStudy');
  const inputFaculty = document.querySelector('#update-student-faculty');

  const data = {
    name: inputName.value.trim(),
    surname: inputSurname.value.trim(),
    lastname: inputLastname.value.trim(),
    birthday: inputBirthday.valueAsDate,
    studyStart: +inputYearStudy.value.trim(),
    faculty: inputFaculty.value.trim(),
  };

  new Students().update(id, data);

  inputName.value = '';
  inputSurname.value = '';
  inputLastname.value = '';
  inputBirthday.value = '';
  inputYearStudy.value = '';
  inputFaculty.value = '';
}

// Фильтрация студентов
function filterStudents({
  studentsArray,
  valuesArr,
}) {
  let filteredStudentsArray = studentsArray;

  function filterStudent(objKey, objVal) {
    filteredStudentsArray = filteredStudentsArray.filter((studentObj) => {
      if (objKey === 'studyFinish') {
        return +studentObj.studyStart.toLowerCase() + 4 === +objVal.toLowerCase();
      }

      return studentObj[objKey].toLowerCase() === objVal.toLowerCase();
    });
  }

  valuesArr.forEach((obj) => {
    if (obj.value !== '') filterStudent(obj.forName, obj.value);
  });

  return filteredStudentsArray;
}

// Сортировака студентов
function sortedStudents({
  studentsArray,
  prop,
  direction = false,
}) {
  return studentsArray.sort((fisrtStudent, secondStudent) => {
    if (prop === 'dateOfBirth') {
      fisrtStudent[prop] = new Date(fisrtStudent[prop]);
      secondStudent[prop] = new Date(secondStudent[prop]);
    }

    const dirIf = direction
      ? fisrtStudent[prop] > secondStudent[prop]
      : fisrtStudent[prop] < secondStudent[prop];

    if (dirIf === true) return -1;
    if (dirIf === false) return 1;
    return 0;
  });
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
  // Получаю массив студентов
  const students = new Students();
  const allStudents = await students.getAll();

  // Рендер списка студентов если список студентов не пуст
  if (allStudents) renderStudentsTable(allStudents);

  // Создание нового студента и перерендер
  const createStudentForm = document.querySelector('.modal-form-create');
  const createModal = new bootstrap.Modal(document.querySelector('#createStudent'));

  const createInputBirthdayValidate = document.querySelector('#create-student-birthday');
  const createInputYearStudyValidate = document.querySelector('#create-student-yearStudy');

  createInputBirthdayValidate.setAttribute('max', new Date().toISOString().split('T')[0]);
  createInputYearStudyValidate.setAttribute('max', new Date().getFullYear());

  createStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    createModal.hide();
    createStudent();
  });

  // Изменение студента и перерендер
  const updateStudentForm = document.querySelector('.modal-form-update');
  const updateModal = new bootstrap.Modal(document.querySelector('#updateStudent'));

  const updateInputBirthdayValidate = document.querySelector('#update-student-birthday');
  const updateInputYearStudyValidate = document.querySelector('#update-student-yearStudy');

  updateInputBirthdayValidate.setAttribute('max', new Date().toISOString().split('T')[0]);
  updateInputYearStudyValidate.setAttribute('max', new Date().getFullYear());

  updateStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    updateModal.hide();
    updateStudent(updateStudentForm.getAttribute('data-id'));
  });

  // Фильтрация и перерендер
  const filterBtn = document.querySelector('#filter-btn');
  filterBtn.addEventListener('click', () => {
    const filterSurname = document.querySelector('#filter-surname');
    const filterName = document.querySelector('#filter-name');
    const filterLastname = document.querySelector('#filter-lastname');
    const filterFaculty = document.querySelector('#filter-faculty');
    const filterYearStudyStart = document.querySelector('#filter-studyStart');
    const filterYearStudyFinish = document.querySelector('#filter-studyFinish');

    const filteredStudents = filterStudents({
      studentsArray: allStudents,
      valuesArr: [
        {
          value: filterSurname.value.trim(),
          forName: 'surname',
        },
        {
          value: filterName.value.trim(),
          forName: 'name',
        },
        {
          value: filterLastname.value.trim(),
          forName: 'lastname',
        },
        {
          value: filterFaculty.value.trim(),
          forName: 'faculty',
        },
        {
          value: filterYearStudyStart.value,
          forName: 'studyStart',
        },
        {
          value: filterYearStudyFinish.value,
          forName: 'studyFinish',
        },
      ],
    });

    renderStudentsTable(filteredStudents);
  });

  // Сброс фильтра и перерендер
  const unfilterBtn = document.querySelector('#unfilter-btn');
  unfilterBtn.addEventListener('click', () => {
    const filterInputs = document.querySelectorAll('.filter-input');

    filterInputs.forEach((filterInput) => {
      filterInput.value = '';
    });
    renderStudentsTable(allStudents);
  });

  // Сортировка и перерендер
  const sortBtns = document.querySelectorAll('.sort-btn');
  sortBtns.forEach((sortBtn) => {
    sortBtn.addEventListener('click', (e) => {
      const currentBtn = e.currentTarget;
      const prop = currentBtn.getAttribute('data-sort');

      if (currentBtn.classList.contains('up')) {
        currentBtn.classList.remove('up');
        currentBtn.classList.add('down');
      } else {
        currentBtn.classList.remove('down');
        currentBtn.classList.add('up');
      }

      const dir = currentBtn.classList.contains('up');

      renderStudentsTable(sortedStudents({
        studentsArray: allStudents,
        prop,
        direction: dir,
      }));
    });
  });
});
