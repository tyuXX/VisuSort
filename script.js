const arrayContainer = document.getElementById("arrayContainer");
const startButton = document.getElementById("startButton");
const arraySizeInput = document.getElementById("arraySize");
const delayInput = document.getElementById("delay");
const algorithmSelect = document.getElementById("algorithm");
const statsDisplay = document.getElementById("statsDisplay");
const minValueInput = document.getElementById("minValue"); // New min value input
const maxValueInput = document.getElementById("maxValue"); // New max value input
let array = [];
let abortController = null;

// Populate algorithm combobox from sorters array
sorters.forEach((sorter) => {
  const option = document.createElement("option");
  option.value = sorter.id;
  option.textContent = sorter.name;
  algorithmSelect.appendChild(option);
});

function updateStatsDisplay(stats) {
  statsDisplay.innerHTML = `
      <p>Elapsed Time: ${stats.elapsedTime} ms</p>
      <p>Comparisons: ${stats.comparisons}</p>
      <p>Swaps: ${stats.swaps}</p>
  `;
}

async function startSorting() {
  // Prevent starting a new sort if one is already in progress
  if (abortController) {
    abortController.abort()
    return; // Exit if sorting is in progress
  }
  
  statsDisplay.innerHTML = ""; // Clear previous stats
  abortController = new AbortController(); // Create a new abort controller for this sort

  const array = generateArray();
  const bars = createBars(array);
  const delay = parseInt(delayInput.value);

  const stats = { comparisons: 0, swaps: 0, elapsedTime: 0 };
  const startTime = Date.now();

  const signal = abortController.signal;

  const selectedSorter = sorters.find(sorter => sorter.id === algorithmSelect.value);

  try {
    await selectedSorter.func(array, bars, delay, signal, stats);
  } catch (error) {
    if (error.message !== "Sort Aborted") throw error;
  } finally {
    stats.elapsedTime = Date.now() - startTime;
    updateStatsDisplay(stats);
    abortController = null; // Reset abort controller when sorting is done
  }
}

// Helper functions
function generateArray() {
  const size = parseInt(arraySizeInput.value);
  const minValue = parseInt(minValueInput.value); // Get min value
  const maxValue = parseInt(maxValueInput.value); // Get max value
  array = Array.from({ length: size }, () =>
    Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue // Generate random value between min and max
  );
  return array; // Return the generated array
}

function createBars(arr) {
  arrayContainer.innerHTML = ""; // Clear existing bars
  const barWidth = Math.max(600 / arr.length, 2); // Minimum width of 2px

  const maxValue = Math.max(...arr); // Find the maximum value in the array
  const containerHeight = 300; // Set your container height, adjust as needed
  const scaleFactor = containerHeight / maxValue; // Calculate the scaling factor

  arr.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * scaleFactor}px`; // Scale height based on the maximum value
    bar.style.width = `${barWidth}px`;
    bar.style.marginRight = "1px"; // Optional: Add a small margin for separation
    arrayContainer.appendChild(bar);
  });
  return arrayContainer.children; // Return the collection of bars for further use
}

function updateBarHeight(bar, value) {
  const maxValue = Math.max(...array); // Get the current maximum value of the array
  const containerHeight = 300; // Set your container height, same as in createBars
  const scaleFactor = containerHeight / maxValue; // Calculate the scaling factor
  bar.style.height = `${value * scaleFactor}px`; // Update the height using the scaling factor
}

function applyDelay(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function handleAbort(signal) {
  if (signal.aborted) throw new Error("Sort Aborted");
}

// Event listener for start button
startButton.addEventListener("click", startSorting);
