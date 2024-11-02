var sorters = [
  {
    name: "Bubble Sort",
    id: "bubble",
    func: async function (array, bars, delay, signal, stats) {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          await handleAbort(signal);
          stats.comparisons++;
          bars[j].classList.add("compare");
          bars[j + 1].classList.add("compare");
          await applyDelay(delay);
          if (array[j] > array[j + 1]) {
            stats.swaps++;
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            updateBarHeight(bars[j], array[j]);
            updateBarHeight(bars[j + 1], array[j + 1]);
          }
          bars[j].classList.remove("compare");
          bars[j + 1].classList.remove("compare");
        }
        bars[array.length - i - 1].classList.add("sorted");
      }
    },
  },
  {
    name: "Selection Sort",
    id: "selection",
    func: async function (array, bars, delay, signal, stats) {
      for (let i = 0; i < array.length; i++) {
        await handleAbort(signal);
        let minIndex = i;
        bars[minIndex].classList.add("compare");
        for (let j = i + 1; j < array.length; j++) {
          await handleAbort(signal);
          stats.comparisons++;
          bars[j].classList.add("compare");
          await applyDelay(delay);
          if (array[j] < array[minIndex]) minIndex = j;
          bars[j].classList.remove("compare");
        }
        if (minIndex !== i) {
          stats.swaps++;
          [array[i], array[minIndex]] = [array[minIndex], array[i]];
          updateBarHeight(bars[i], array[i]);
          updateBarHeight(bars[minIndex], array[minIndex]);
        }
        bars[minIndex].classList.remove("compare");
        bars[i].classList.add("sorted");
      }
    },
  },
  {
    name: "Insertion Sort",
    id: "insertion",
    func: async function (array, bars, delay, signal, stats) {
      for (let i = 1; i < array.length; i++) {
        await handleAbort(signal);
        let current = array[i];
        let j = i - 1;
        bars[i].classList.add("compare");
        while (j >= 0 && array[j] > current) {
          await handleAbort(signal);
          stats.comparisons++;
          stats.swaps++;
          array[j + 1] = array[j];
          updateBarHeight(bars[j + 1], array[j]);
          bars[j].classList.add("compare");
          await applyDelay(delay);
          bars[j].classList.remove("compare");
          j--;
        }
        array[j + 1] = current;
        updateBarHeight(bars[j + 1], current);
        bars[i].classList.remove("compare");
        bars[i].classList.add("sorted");
      }
    },
  },
  {
    name: "Quick Sort",
    id: "quick",
    func: async function quickSort(
      array,
      bars,
      delay,
      signal,
      stats,
      low = 0,
      high = array.length - 1
    ) {
      async function partition(low, high) {
        let pivot = array[high];
        let i = low - 1;
        bars[high].classList.add("pivot");
        for (let j = low; j < high; j++) {
          await handleAbort(signal);
          stats.comparisons++;
          bars[j].classList.add("compare");
          await applyDelay(delay);
          if (array[j] < pivot) {
            i++;
            stats.swaps++;
            [array[i], array[j]] = [array[j], array[i]];
            updateBarHeight(bars[i], array[i]);
            updateBarHeight(bars[j], array[j]);
          }
          bars[j].classList.remove("compare");
        }
        stats.swaps++;
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        updateBarHeight(bars[i + 1], array[i + 1]);
        updateBarHeight(bars[high], array[high]);
        bars[high].classList.remove("pivot");
        bars[i + 1].classList.add("sorted");
        return i + 1;
      }

      if (low < high) {
        let pi = await partition(low, high);
        await quickSort(array, bars, delay, signal, stats, low, pi - 1);
        await quickSort(array, bars, delay, signal, stats, pi + 1, high);
      }
    },
  },
  {
    name: "Radix Sort",
    id: "radix",
    func: async function (array, bars, delay, signal, stats) {
      const max = Math.max(...array);
      let exp = 1;
      while (Math.floor(max / exp) > 0) {
        await handleAbort(signal);
        let output = new Array(array.length).fill(0);
        let count = new Array(10).fill(0);

        for (let i = 0; i < array.length; i++) {
          stats.comparisons++;
          count[Math.floor(array[i] / exp) % 10]++;
        }

        for (let i = 1; i < 10; i++) {
          count[i] += count[i - 1];
        }

        for (let i = array.length - 1; i >= 0; i--) {
          let index = Math.floor(array[i] / exp) % 10;
          output[--count[index]] = array[i];
          stats.swaps++;
        }

        for (let i = 0; i < array.length; i++) {
          array[i] = output[i];
          updateBarHeight(bars[i], array[i]);
          bars[i].classList.add("compare");
          await applyDelay(delay);
          bars[i].classList.remove("compare");
        }

        exp *= 10;
      }

      for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add("sorted");
      }
    },
  },
];
