// Currency formatting utilities for Indian Rupees

export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
};

// Convert USD to INR (approximate rate for demo)
export const USD_TO_INR = 83;
