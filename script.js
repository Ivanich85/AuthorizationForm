'use strict';

// Код валидации формы

function validateForm({ formId, formValidClass, formInvalidClass, inputErrorClass }) {
    var form = getDomElementById(formId);

    form.addEventListener("focus", function (event) {
        var domElement = getDomElementById(event.target.id);
        if (event.target.tagName === 'INPUT') {
            domElement.classList.remove(inputErrorClass);
        }
    }, true);

    form.addEventListener("blur", function (event) {
        var domElement = getDomElementById(event.target.id);
        if (event.target.tagName === 'INPUT') {
            if (!isElementValueCorrect(event.target.id)) {
                domElement.classList.add(inputErrorClass);
            }
        }
    }, true);

    form.addEventListener("click", function (event) {
        if (event.target.tagName === 'BUTTON') {
            var arr = document.querySelectorAll('input');
            if (isFormValid(document.querySelectorAll('input'), inputErrorClass)) {                
                form.classList.add(formValidClass);
                form.classList.remove(formInvalidClass);
            } else {
                form.classList.add(formInvalidClass);
                form.classList.remove(formValidClass);
            }
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
    }, true);

}

// проверка элемента
function isElementValueCorrect(elementId) {
    var element = getDomElementById(elementId);
    switch (element.dataset.validator) {
        case 'letters':
            return isProfileNameCorrect(element.value);
        case 'number':
            return isProfileAgeOrFavoriteNumberCorrect(element.dataset, element.value)
        case 'regexp':
            return isProfilePhoneNumberCorrect(element.dataset, element.value);
        default:
            return true;
    }
}

function isProfileNameCorrect(elementValue) {
    return !hasPattern(elementValue, new RegExp('\\d')) && !isEmpty(elementValue);
}

function isProfileAgeOrFavoriteNumberCorrect(dataArr, elementValue) {
    // Проверка для возраста
    if (dataArr.validatorMin && dataArr.validatorMax) {
        return !hasPattern(elementValue, new RegExp('\\D')) && elementValue >= Number(dataArr.validatorMin) && elementValue <= Number(dataArr.validatorMax);
    }
    // Любимое число необязательное значение, поэтому на пустоту не проверяем
    return !hasPattern(elementValue, new RegExp('\\D'));
}

function isProfilePhoneNumberCorrect(dataArr, elementValue) {          
    return hasPattern(elementValue, new RegExp(dataArr.validatorPattern)) || isEmpty(elementValue);
}

function isEmpty(value) {
    return value === '';
}

function hasPattern(value, pattern) {
    return pattern.test(value);
}

function getDomElementById(elementId) {
    return document.querySelector('#' + elementId);
}

function isFormValid(elementsArr, inputErrorClass) {
    var isValid = true;
    elementsArr.forEach(function(item, arr) {
        if (!isElementValueCorrect(item.id)) {
            item.classList.add(inputErrorClass);
        } else {
            item.classList.remove(inputErrorClass);
        }
        if (item.classList.contains(inputErrorClass)) {
            isValid = false;
        }
    });
    return isValid;
}
