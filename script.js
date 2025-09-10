const fromCurrencyElement = document.getElementById('from-currency');
const toCurrencyElement = document.getElementById('to-currency');
const amountElement = document.getElementById('amount');
const resultElement = document.getElementById('result');
const swapButton = document.querySelector('.swap-icon');

// API URL for currencies list
const currenciesURL = 'https://api.frankfurter.app/currencies';
const latestRatesURL = 'https://api.frankfurter.app/latest';

// 1. Fetch and populate currency dropdowns
async function populateCurrencies() {
    try {
        const response = await fetch(currenciesURL);
        const currencies = await response.json();

        for (const currency in currencies) {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = `${currency} - ${currencies[currency]}`;
            fromCurrencyElement.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = `${currency} - ${currencies[currency]}`;
            toCurrencyElement.appendChild(option2);
        }
        // Set default values
        fromCurrencyElement.value = 'USD';
        toCurrencyElement.value = 'INR';

        // Perform initial conversion
        convert();
    } catch (error) {
        resultElement.textContent = `Error: ${error.message}`;
    }
}

// 2. Perform the conversion
async function convert() {
    const amount = amountElement.value;
    const fromCurrency = fromCurrencyElement.value;
    const toCurrency = toCurrencyElement.value;

    if (amount === '' || amount < 0) {
        resultElement.textContent = 'Please enter a valid amount.';
        return;
    }

    if (fromCurrency === toCurrency) {
        resultElement.textContent = `${amount} ${fromCurrency} = ${amount} ${toCurrency}`;
        return;
    }
    
    resultElement.textContent = 'Converting...'; // Provide feedback

    try {
        const response = await fetch(`${latestRatesURL}?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
        const data = await response.json();
        
        const rate = data.rates[toCurrency];
        resultElement.textContent = `${amount} ${fromCurrency} = ${rate.toFixed(2)} ${toCurrency}`;

    } catch (error) {
        resultElement.textContent = `Error fetching rate. Please try again.`;
    }
}

// 3. Add Event Listeners
amountElement.addEventListener('input', convert);
fromCurrencyElement.addEventListener('change', convert);
toCurrencyElement.addEventListener('change', convert);

swapButton.addEventListener('click', () => {
    // Swap the selected currencies
    const temp = fromCurrencyElement.value;
    fromCurrencyElement.value = toCurrencyElement.value;
    toCurrencyElement.value = temp;
    // Recalculate after swapping
    convert();
});

// Initial population of currencies when the page loads
populateCurrencies();