$(document).ready(function() {

  let currentJson = {};

  let ingredientIndex = 0;
  let stepIndex = 0;

  const loadFileInput = $('#loadFileInput');
  const ingredientsTBody = $('#ingredients');
  const stepsDiv = $('#steps');

  function addIngredient(ingredient) {
    ingredientIndex = ingredientIndex + 1;
    const newIngredientRowHtml = getIngredientRowHtml(ingredientIndex, ingredient);
    ingredientsTBody.append($.parseHTML(newIngredientRowHtml));
  }

  function addStep(step) {
    stepIndex = stepIndex + 1;
    const newStepRowHtml = getStepRowHtml(stepIndex, step);
    stepsDiv.append($.parseHTML(newStepRowHtml));
  }

  $('#loadFileButton').click(function(e) {
    e.preventDefault();
    const file = loadFileInput[0].files[0];

    if (!file || file.type !== "application/json") {
      alert('Please select a valid JSON file.');
      return;
    }
    console.log('selected file: ' + file.name);
    clearForm();

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      const contents = e.target.result;
      currentJson = JSON.parse(contents);
      console.log("loaded data: " + JSON.stringify(currentJson));
      populateInputsFromCurrentJson();
    }
    fileReader.readAsText(file);
  });

  $('#addIngredientButton').click(function(e) {
    e.preventDefault();
    addIngredient();
  });

  $('#addStepButton').click(function(e) {
    e.preventDefault();
    addStep();
  });

  $('#toJsonButton').click(function(e) {
    e.preventDefault();

    const recipeId = $('#recipeId').val();
    const recipeName = $('#recipeName').val();
    const prepTimeKind = $('#prepTimeKind').val();
    const prepTimeValue = Number($('#prepTimeValue').val());
    const cookTimeKind = $('#cookTimeKind').val();
    const cookTimeValue = Number($('#cookTimeValue').val());
    const yieldKind = $('#yieldKind').val();
    const yieldValue = Number($('#yieldValue').val());
    const keywords = $('#keywords').val()
      .split(',')
      .filter(keyword => keyword.length > 0)
      .map(keyword => keyword.trim());

    const calories = Number($('#calories').val());
    const fats = Number($('#fats').val());
    const carbohydrates = Number($('#carbohydrates').val());
    const sugars = Number($('#sugars').val());
    const protein = Number($('#protein').val());

    const ingredients = [];
    const steps = [];

    $('.ingredient-table-row').each(function() {
      const name = $(this).find('.ingredient-name').val();
      const qKind = $(this).find('.ingredient-qty-kind').val();
      const qVal = $(this).find('.ingredient-qty-val').val();
      const notes = $(this).find('.ingredient-notes').val();

      const ingredient = {
        name,
        quantity: {
          kind: qKind,
          value: qVal,
        },
        notes,
      };

      ingredients.push(ingredient);
    });

    const stepTexts = $('.step-text');
    for (let i = 0; i < stepTexts.length; i++) {
      steps.push({
        id: i,
        text: stepTexts[i].value,
      });
    }

    currentJson = {
      recipeId,
      recipeName,
      prep: {
        kind: prepTimeKind,
        value: prepTimeValue,
      },
      cook: {
        kind: cookTimeKind,
        value: cookTimeValue,
      },
      yield: {
        kind: yieldKind,
        value: yieldValue,
      },
      ingredients,
      steps,
      keywords,
      nutrition: {
        calories: calories <= 0 ? null : calories,
        fats: fats <= 0 ? null : fats,
        carbohydrates: carbohydrates <= 0 ? null : carbohydrates,
        sugars: sugars <= 0 ? null : sugars,
        protein: protein <= 0 ? null : protein,
      },
    };

    $('#outputTextBox').val(JSON.stringify(currentJson, null, 2));

    activateOutputTab();
  });

  function activateOutputTab() {
    $('#inputTabPane').removeClass('show active');
    $('#inputTab').removeClass('active');
    $('#outputTabPane').addClass('show active');
    $('#outputTab').addClass('active');
  }

  function populateInputsFromCurrentJson() {
    $('#recipeId').val(currentJson.recipeId);
    $('#recipeName').val(currentJson.recipeName);
    $('#keywords').val(currentJson.keywords?.join(","));
    $('#prepTimeKind').val(currentJson.prep.kind);
    $('#prepTimeValue').val(currentJson.prep.value);
    $('#cookTimeKind').val(currentJson.cook.kind);
    $('#cookTimeValue').val(currentJson.cook.value);
    $('#yieldKind').val(currentJson.yield.kind);
    $('#yieldValue').val(currentJson.yield.value);
    $('#calories').val(currentJson?.nutrition?.calories);
    $('#fats').val(currentJson?.nutrition?.fats);
    $('#carbohydrates').val(currentJson?.nutrition?.carbohydrates);
    $('#sugars').val(currentJson?.nutrition?.sugars);
    $('#protein').val(currentJson?.nutrition?.protein);

    for (let i = 0; i < currentJson.ingredients.length; i++) {
      const ingredient = currentJson.ingredients[i];
      addIngredient(ingredient);
    }

    for (let i = 0; i < currentJson.steps.length; i++) {
      const step = currentJson.steps[i];
      addStep(step);
    }
  }

  function clearForm() {
    // blank out fields
    $('#recipeId').val('');
    $('#recipeName').val('');
    $('#keywords').val('');
    $('#prepTimeKind').val('');
    $('#prepTimeValue').val('');
    $('#cookTimeKind').val('');
    $('#cookTimeValue').val('');
    $('#yieldKind').val('');
    $('#yieldValue').val('');
    $('#calories').val('');
    $('#fats').val('');
    $('#carbohydrates').val('');
    $('#sugars').val('');
    $('#protein').val('');

    // remove ingredients and steps
    ingredientsTBody.empty();
    stepsDiv.empty();

    // reset state variables
    ingredientIndex = 0;
    stepIndex = 0;
    currentJson = {};
  }

  function getIngredientRowHtml(rowIndex, ingredient) {
    let name = '';
    let quantityKind = '';
    let quantityValue = '';
    let notes = '';

    if (ingredient) {
      name = ingredient.name;
      quantityKind = ingredient.quantity.kind;
      quantityValue = ingredient.quantity.value;
      notes = ingredient.notes;
    }

    return `
    <tr id="ingredient${rowIndex}" class="ingredient-table-row">
      <td><input class="ingredient-row ingredient-name" type="text" name="ingredientName${rowIndex}" id="ingredientName${rowIndex}" value="${name}"></td>
      <td><input class="ingredient-row ingredient-qty-val" type="number" name="quantityValue${rowIndex}" id="quantityValue${rowIndex}" value="${quantityValue}"></td>
      <td><input class="ingredient-row ingredient-qty-kind" type="text" name="quantityKind${rowIndex}" id="quantityKind${rowIndex}" value="${quantityKind}"></td>
      <td><input class="ingredient-row ingredient-notes" type="text" name="notes${rowIndex}" id="notes${rowIndex}" value="${notes}"></td>
      <td>
        <input class="ingredient-row btn btn-sm btn-danger" type="button" name="ingredientDeleteButton${rowIndex}" id="ingredientDeleteButton${rowIndex}" 
           value="X" onclick="deleteIngredientRowByIndex(${rowIndex})"/>
      </td>
    </tr>
  `;
  }

  function getStepRowHtml(rowIndex, step) {
    let stepText = '';

    if (step) {
      stepText = step.text;
    }

    return `
      <div class="row step-row" id="step${rowIndex}" style="padding-top: 10px;">
        <div class="col-11">
          <input type="text" class="form-control step-text" name="stepText${rowIndex}" id="stepText${rowIndex}" value="${stepText}">
        </div>
        <div class="col-1">
           <input class="btn btn-sm btn-danger" type="button" name="stepDeleteButton${rowIndex}" id="stepDeleteButton${rowIndex}" 
             value="X" onclick="deleteStepRowByIndex(${rowIndex})"/>
        </div>
      </div>  
  `;
  }
});

function deleteIngredientRowByIndex(rowIndex) {
  document.getElementById(`ingredient${rowIndex}`).remove();
}

function deleteStepRowByIndex(rowIndex) {
  document.getElementById(`step${rowIndex}`).remove();
}

const triggerTabList = document.querySelectorAll('#myTab button')
triggerTabList.forEach(triggerEl => {
  const tabTrigger = new bootstrap.Tab(triggerEl);

  triggerEl.addEventListener('click', event => {
    event.preventDefault();
    tabTrigger.show();
  });
});