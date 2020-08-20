//Generate mailto URL with recipient emails, subject, and body
function getMailtoUrl(to, subject, body) {
    var args = [];
    if (typeof subject !== "undefined") {
        args.push("subject=" + encodeURIComponent(subject));
    }
    if (typeof body !== "undefined") {
        args.push("body=" + encodeURIComponent(body))
    }

    var url = "mailto:" + to;
    if (args.length > 0) {
        url += "?" + args.join("&");
    }
    return url;
}

//Choose a random element from the items array
function choice(items) {
    return items[Math.floor(Math.random() * items.length)];
}

//Return a random permutation of the items array
function shuffle(items) {
    var array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//Return an action which chooses a random element from the items array
function choiceAction(items) {
    return () => choice(items);
}

//Return an action which randomly shuffles the items array
// and then returns a string containing all of the items in a comma-separated list
function shuffleCommaSepListAction(items) {
    return function() {
        var is = shuffle(items);
        return is.slice(0,-1).join(", ").concat(", and ", is.slice(-1));
    }
}

//Return an action which randomly shuffles the items array
// and then returns a string containing all of the items in a numbered list
function shuffleNumberedList(items) {
    return function() {
        var is = shuffle(items);
        for (var i = 1; i <= is.length; i++) {
            is[i-1] = i.toString()+". "+is[i-1];
        }
        return is.join("\n\n");
    }
}

const EMAILS = "presidentaoun@northeastern.edu, office_of_the_president@northeastern.edu, chancellor@northeastern.edu, d.madigan@northeastern.edu, g.serra@northeastern.edu, m.french@northeastern.edu, k.henderson@northeastern.edu"

const SUBJECTS = ["{{subject_opener}}: Concerns {{ regarding }}{{ plans_for }} {{ fall_reopening }}",
"{{subject_opener}}: NU CARE demands {{ regarding }} {{ fall_reopening }}"]

const OPENING = (name, position, blurb) => 
`Hello,

My name is ${name} and as a ${position}, I am deeply concerned about {{ northeastern }}'s {{ fall_reopening }}. ${blurb}

Therefore, I ask {{ northeastern }} to implement the following five demands to ensure a safe and equitable reopening.`

//The following demands are from the new e-mail script. TO see the original demands, go to https://raw.githubusercontent.com/doesnucare/email/56e1e29144aa2db1476c3f8cd8aa66358a4784e8/js/email.js
const DEMANDS = ["Northeastern must allow any student to cancel their housing up until their move-in date *without any cancellation charge*. After seeing four clusters of COVID cases pop up within one week at University of North Carolina at Chapel Hill [1], many students are having second thoughts about returning to campus. While we understand Northeastern may be safer than UNC Chapel Hill due to Northeastern's frequent testing, de-densifying campus is still imperative for minimizing the risk of an outbreak. Therefore, Northeastern must allow students to cancel their housing without charge to decrease the number of students who return to campus.",
"Northeastern must grant any requests from instructors who asked to work remotely and give instructors the option to start teaching remotely at any time. Many Northeastern grad students and faculty have still not heard back about their requests for remote work this Fall 2020 despite being told they will receive a final decision by August 15 [2]. The fact that the university has failed to meet its own self-imposed deadline for releasing decisions is ridiculous, and it is critical that Northeastern allow all faculty and staff who want to work remotely to do so, in order to de-densify campus as much as possible.",
"Northeastern must commit to guaranteeing adequate PPE and hazard pay for at-risk workers, like dining workers. While Northeastern has said that face coverings will be available on the Boston campus, it has also said that community members are expected to bring their own face coverings. However, if Northeastern does not work to *guarantee* that all workers have access to adequate PPE, workers may need to reuse disposable masks, which puts both their own health and the health of others at risk. Moreover, when asked about hazard pay in an interview with Hunt News, Chancellor Henderson simply said, \"I don’t believe that’s in the planning,\" which is absolutely unacceptable [3]. All NEU workers in hazardous working environments, including subcontractors, deserve to receive hazard pay during the COVID-19 pandemic.",
"Northeastern must reduce tuition for the 2020-21 academic year, and deliver refunds to students who have already paid tuition. Continuing to raise tuition in the middle of a global pandemic and unprecedented economic crisis is absurd and harms at-risk students the most. Moreover, Northeastern was projected to end the 2020 fiscal year with a $28.5 million budget surplus due to decreased operating costs while campus was closed [4], which shows that having the same tuition price for online classes is wholly unnecessary.",
"Northeastern must be transparent about their emergency plans in case the university needs to transition to all-online classes. For example, when asked by Hunt News about what specific thresholds would make Northeastern close down campus, Senior Vice Chancellor Estabrook simply said, \"There aren't any clear line benchmarks yet,\" which is not transparent at all [5]. In contrast, Brandeis University has said clearly that they will shut down campus if positive test rates exceed 5 percent [6], and Northeastern should set similar thresholds for triggering a campus shutdown. Northeastern should also be clear about what precautions will be taken to minimize the risk to students’ families and hometown communities if dormitories close and students must return home. So far, we have heard almost nothing about contingency plans in the case that campus shuts down, which shows that Northeastern has failed to properly plan for the worst-case scenario."]

//Not used any more:
//const AFTER_DEMANDS = "I am personally endorsing these demands, and I am not alone. NU CARE is supported by Northeastern groups across campus who care about a range of topics such as {{ club_topics }}. Students with diverse interests on campus are coming together to say they care about equity and safety as well as the “experience” the re-opening team has emphasized. These are some of the groups who endorse NU CARE: "

//Not used any more:
const CLUBS = ["Northeastern Young Democratic Socialists of America",
"Progressive Student Alliance",
"Northeastern College Democrats ",
"Sunrise Northeastern",
"Northeastern for Biden",
"Interdisciplinary Women's Council at Northeastern University ",
"Husky Environmental Action Team ",
"Northeastern University Huskiers and Outing Club ",
"Students for Justice in Palestine ",
"Peer Health Exchange ",
"Global Medical Brigades",
"National Organization of Minority Architecture Students at Northeastern",
"American Institute of Architects - Students"]

const CLOSING = "Meeting these five demands are essential to ensuring the safety and well-being of the community as {{ northeastern }} reopens for the Fall 2020 semester. I look forward to seeing {{ northeastern }} commit to these five demands before campus reopens."

const SIGNATURE = (name, position) => 
`Sincerely,
${name},
${position}

[1] wapo.st/2Ecax98
[2] bit.ly/328NWTn
[3] bit.ly/2EjmVnD
[4] bit.ly/3284meD
[5] bit.ly/3aEhsUL
[6] bit.ly/34emnL2`

//Given user's name, position, and reason for supporting NU CARE,
// generate the to, subject, and body of a possible e-mail
function generateEmail(name, position, blurb) {
    var subject = Sentencer.make(choice(SUBJECTS));
    var body_raw = 
    `${OPENING(name, position, blurb)}
    
{{ demands }}
    
${CLOSING}
    
${SIGNATURE(name, position)}`

    var body = Sentencer.make(body_raw);

    return {
        to: EMAILS,
        subject: subject,
        body: body
    }
}

var Sentencer = require("sentencer");

Sentencer.configure({
    // additional actions for the template engine to use.
    // you can also redefine the preset actions here if you need to.
    // See the "Add your own actions" section below.
    actions: {
      subject_opener: choiceAction(["URGENT", "IMPORTANT", "PLEASE READ"]),
      regarding: choiceAction(["about", "regarding"]),
      plans_for: choiceAction([" plans for", ""]),
      fall_reopening: choiceAction(["fall re-opening", "re-opening in the fall"]),
      just_safe: shuffleCommaSepListAction(["just", "safe", "conscientious"]),
      testing_housing: shuffleCommaSepListAction(["testing", "housing", "dining", "the logistics of campus life"]),
      students_faculty: shuffleCommaSepListAction(["students", "faculty", "staff", "neighboring communities"]),
      club_topics: shuffleCommaSepListAction(["health", "sports", "politics", "architecture", "climate resiliency"]),
      clubs: shuffleNumberedList(CLUBS),
      demands: shuffleNumberedList(DEMANDS),
      northeastern: choiceAction(["Northeastern", "the University"]),
      covid: choiceAction(["COVID-19", "COVID", "Coronavirus"]),
      in_the: choiceAction(["in the", "this"]),
    }
});

//Fill in the textboxes for name, position, and the quote, if the information is supplied in the query parameters from the URL
function fillTextboxesIn() {
    //Dictionary holding the query parameters from the URL:
    var queryParameters = {};

    //Split the query string up by the ampersands:
    var queryStringParts = window.location.search.substring(1).split("&");
    //For each item, store the query parameter in the above dictionary:
    queryStringParts.forEach(function(item) {
        var twoParts = item.split("=");
        if (twoParts.length != 2) {
            console.log("Error parsing query parameter: "+item);
            return;
        }
        //Remember to replace +s with spaces.
        queryParameters[twoParts[0]] = decodeURIComponent(twoParts[1]).split("+").join(" ");
    });

    //If a name/job/quote was supplied, then fill in the corresponding textbox:
    if (queryParameters.hasOwnProperty("name")) {
        document.getElementById("name-input").value = queryParameters["name"];
    }
    if (queryParameters.hasOwnProperty("job")) {
        document.getElementById("job-input").value = queryParameters["job"];
    }
    if (queryParameters.hasOwnProperty("quote")) {
        document.getElementById("quotation").value = queryParameters["quote"];
    }
}
fillTextboxesIn();