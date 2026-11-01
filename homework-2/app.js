const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

let data;

const showProgramButton = document.querySelector("#show-program");
const program = document.querySelector("#program");
const serviceForm = document.querySelector("#service-form");
const choiceError = document.querySelector("#choice-error");
const dataError = document.querySelector("#data-error");
const result = document.querySelector("#result");
const reportJson = document.querySelector("#report-json");

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selection = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked,
  };

  const items = services
    .filter((service) => selection[service.id])
    .map(({ title, price }) => ({
      title: title.trim(),
      price,
    }));

  const total = items.reduce((sum, { price }) => sum + price, 0);

  return {
    count: items.length,
    total,
    items,
  };
}

function showProgram() {
  program.innerHTML = data.event.meeting;
  program.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();

  const guideChecked = document.querySelector("#guide").checked;
  const audioChecked = document.querySelector("#audio").checked;
  const catalogChecked = document.querySelector("#catalog").checked;
  const report = buildReport(
    data.services,
    guideChecked,
    audioChecked,
    catalogChecked,
  );

  if (report.count === 0) {
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  choiceError.hidden = true;
  result.innerHTML = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.<br>${report.items
    .map(({ title }) => title)
    .join("<br>")}`;

  const reportString = JSON.stringify(report);
  JSON.parse(reportString);
  reportJson.textContent = reportString;

  result.hidden = false;
  reportJson.hidden = false;
}

try {
  data = JSON.parse(sourceJson);
  serviceForm.hidden = false;
  showProgramButton.addEventListener("click", showProgram);
  serviceForm.addEventListener("submit", handleSubmit);
} catch {
  serviceForm.hidden = true;
  dataError.hidden = false;
}
