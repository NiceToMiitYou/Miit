

function QuizValidation(questions, choices) {
    this.questions = questions || [];
    this.choices   = choices   || [];

    // Default values
    this.clean  = []; // Store cleaned choices
    this.errors = []; // Store errors
    this.valid  = false;
}


// Define new questions
QuizValidation.prototype.setQuestions = function(questions) {
    this.questions = questions;
};

// Define new choices
QuizValidation.prototype.setChoices = function(choices) {
    this.choices = choices;
};

// List errors
QuizValidation.prototype.getErrors = function() {
    return this.errors;
};

// List of cleaned choices
QuizValidation.prototype.getChoices = function() {
    return this.clean;
};

// Is choices valid
QuizValidation.prototype.isValid = function() {
    return this.valid;
};

QuizValidation.prototype.addError = function(error) {
    this.errors.push(error);

    this.valid = false;
};

// Private method for unique question
function handleUniqueQuestion(question, choices) {
    // Too many choices
    if(1 < choices.length) {
        this.addError({
            question: question.id,
            error:    'TOO_MANY_CHOICES'
        });

        return;
    }
    
    var choice = choices[0];
    var answer = question.answers.findBy('id', choice.id);

    if(!answer) {
        this.addError({
            question: question.id,
            error:    'CHOICE_NOT_EXIST'
        });

        return;
    }
    
    // Prepare clean choice
    var clean = {
        id:      question.id,
        choices: [{
            id: answer.id
        }]
    };

    // Handle open answer
    if(2 === answer.kind) {
        var text = choice.text;

        // No text and answer required
        if(!text && true === question.required) {

            this.addError({
                question: question.id,
                error:    'CHOICE_REQUIRED'
            });

            return;
        }

        // If there is a text, save it
        if(text) {
            clean.choices[0]['text'] = text;
        }
    }

    // Save the answer
    this.clean.push(clean);
}

// Private method for multiple question
function handleMultipleQuestion(question, choices) {    
    var error = false;
    
    var clean = {
        id:      question.id,
        choices: []
    };

    choices.forEach(function(choice){
        var answer = question.answers.findBy('id', choice.id);

        if(!answer) {
            this.addError({
                question: question.id,
                error:    'CHOICE_NOT_EXIST'
            });

            error = true;

            return;
        }

        var cleanedChoice = {
            id: answer.id
        };

        // Handle open answer
        if(2 === answer.kind) {
            var text = choice.text;

            // No text and answer required
            if(
                (
                    !text || typeof text !== 'string' || !text.trim()
                ) &&
                true === question.required
            ) {

                this.addError({
                    question: question.id,
                    error:    'CHOICE_REQUIRED'
                });

                error = true;

                return;
            }

            // If there is a text, save it
            if(text) {
                cleanedChoice['text'] = text.trim();
            }
        }

        clean.choices.push(cleanedChoice);
    })

    if(true === error) {
        return;
    }

    // Save the answer
    this.clean.push(clean);
}

// Private method for unique question
function handleOpenQuestion(question, choices) {
    // Too many choices
    if(1 < choices.length) {
        this.addError({
            question: question.id,
            error:    'TOO_MANY_CHOICES'
        });

        return;
    }
    
    var choice = choices[0];
    var answer = question.answers.findBy('id', choice.id);

    if(!answer) {
        this.addError({
            question: question.id,
            error:    'CHOICE_NOT_EXIST'
        });

        return;
    }

    // Handle open answer
    var text = choice.text;

    // No text ignore it
    if(!text || typeof text !== 'string' || !text.trim()) {

        // But check if required
        if(true === question.required) {
            this.addError({
                question: question.id,
                error:    'CHOICE_REQUIRED'
            });
        }

        return;
    }
    
    // Prepare clean choice
    var clean = {
        id:      question.id,
        choices: [{
            id:   answer.id,
            text: text.trim()
        }]
    };

    // Save the answer
    this.clean.push(clean);
}

// Process the validation
QuizValidation.prototype.validate = function() {
    this.valid  = true;
    this.errors = [];
    this.clean  = [];

    if(0 === this.choices.length) {
        this.addError({
            error: 'NO_CHOICES'
        });

        return;
    }

    if(0 === this.questions.length) {
        this.addError({
            error: 'NO_QUESTIONS'
        });

        return;
    }
        // Check all questions
    this.questions.forEach(function(question) {

        // If no answers for this questions
        if(!question.answers && 0 === question.answers.length) {
            return;
        }

        // Find the choice for the question
        var choice = this.choices.findBy('id', question.id);

        // If not choice and question is required
        if(
            true === question.required &&
            (
                !choice || !choice.choices || 0 === choice.choices.length
            )
        ) {
            this.addError({
                question: question.id,
                error:    'CHOICE_REQUIRED'
            });

            return;
        }

        // If there is a choice
        if(choice && choice.choices && 0 !== choice.choices.length)
        {
            var answers = question.answers || [],
                choices = choice.choices;

            switch(question.kind) {
                // Unique choice question
                case 1:
                    handleUniqueQuestion.call(this, question, choices);

                    break;

                // Multiple choice question
                case 2:
                    handleMultipleQuestion.call(this, question, choices);

                    break;

                // Open question
                case 3:
                    handleOpenQuestion.call(this, question, choices);

                    break;
            }
        }
    }, this);
};

module.exports = QuizValidation;
