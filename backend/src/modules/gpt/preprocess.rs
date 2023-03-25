use html2text::from_read;
use regex::Regex;
use rust_stemmers::{Algorithm, Stemmer};
use std::error::Error;
use stop_words::{get, LANGUAGE};

pub fn preprocess(job_description: &str) -> Result<String, Box<dyn Error>> {
    let mut result = job_description.to_string();

    result = strip_html(&result)?;
    result = combine_sentences(&result)?;
    result = remove_urls(&result)?;
    result = remove_emails(&result)?;
    result = remove_number_words(&result)?;

    result = abbreviate_common_phrases(&result)?;
    result = use_contractions(&result)?;
    result = remove_unnecessary_words(&result)?;

    result = stop_words_and_stemming(&result)?;
    result = strip_special_chars(&result)?;

    result = remove_unnecessary_spaces(&result)?;

    Ok(result)
}

fn stop_words_and_stemming(text: &str) -> Result<String, Box<dyn std::error::Error>> {
    let stop_words = get(LANGUAGE::English);
    let exclusions = ["full"];

    let re = Regex::new(r"\b\w+\b")?;
    let en_stemmer = Stemmer::create(Algorithm::English);
    let mut result = String::new();

    for word in re.find_iter(text) {
        let word_str = word.as_str().to_lowercase();
        if exclusions.contains(&word_str.as_str()) || !stop_words.contains(&word_str) {
            let stemmed = en_stemmer.stem(&word_str);
            result.push_str(&stemmed);
            result.push(' ');
        }
    }

    Ok(result.trim().to_string())
}

fn strip_html(text: &str) -> Result<String, String> {
    Ok(from_read(text.as_bytes(), 80))
}

fn strip_special_chars(text: &str) -> Result<String, String> {
    let mut result = String::new();
    for c in text.chars() {
        if c.is_ascii_alphanumeric() || c.is_ascii_whitespace() {
            result.push(c);
        }
    }
    Ok(result)
}

fn remove_number_words(text: &str) -> Result<String, String> {
    let re = Regex::new(r"\b\d+\b").unwrap();
    Ok(re.replace_all(text, "").to_string())
}

fn abbreviate_common_phrases(job_description: &str) -> Result<String, regex::Error> {
    let replacements = [
        (r"\bfor example\b", "e.g."),
        (r"\bthat is\b", "i.e."),
        (r"\bUnited States\b", "US"),
        (r"\bUnited Kingdom\b", "UK"),
        (r"\bEuropean Union\b", "EU"),
        (r"\bestimated time of arrival\b", "ETA"),
        (r"\bpost meridiem\b", "PM"),
        (r"\bante meridiem\b", "AM"),
        (r"\bWorld Wide Web\b", "WWW"),
        (r"\bas soon as possible\b", "ASAP"),
        (r"\bwith reference to\b", "WRT"),
        (r"\bat the moment\b", "ATM"),
        (r"\bto be honest\b", "TBH"),
        (r"\bby the way\b", "BTW"),
        (r"\bin my opinion\b", "IMO"),
        (r"\bnot safe for work\b", "NSFW"),
        (r"\bsafe for work\b", "SFW"),
        (r"\bto the best of my knowledge\b", "TBMK"),
        (r"\bto my knowledge\b", "TMK"),
        (r"\bthank you\b", "TY"),
        (r"\bthanks in advance\b", "TIA"),
        (r"\bdate of birth\b", "DOB"),
        (r"\bin other words\b", "IOW"),
        (r"\bI don't know\b", "IDK"),
        (r"\bat your earliest convenience\b", "AYEC"),
    ];

    let mut result = String::from(job_description);

    for (pattern, replacement) in &replacements {
        let re = Regex::new(pattern)?;
        result = re.replace_all(&result, *replacement).to_string();
    }

    Ok(result)
}

fn use_contractions(job_description: &str) -> Result<String, regex::Error> {
    let contractions = [
        (r"\bcannot\b", "can't"),
        (r"\bwill not\b", "won't"),
        (r"\bdo not\b", "don't"),
        (r"\bis not\b", "isn't"),
        (r"\bhas not\b", "hasn't"),
        (r"\bhave not\b", "haven't"),
        (r"\bhad not\b", "hadn't"),
        (r"\bdoes not\b", "doesn't"),
        (r"\bdid not\b", "didn't"),
        (r"\bshould not\b", "shouldn't"),
        (r"\bcould not\b", "couldn't"),
        (r"\bwould not\b", "wouldn't"),
        (r"\bmust not\b", "mustn't"),
        (r"\bshall not\b", "shan't"),
        (r"\bmight not\b", "mightn't"),
        (r"\bmay not\b", "mayn't"),
        (r"\bI am\b", "I'm"),
        (r"\bI have\b", "I've"),
        (r"\bI would\b", "I'd"),
        (r"\bI will\b", "I'll"),
        (r"\bhe is\b", "he's"),
        (r"\bhe has\b", "he's"),
        (r"\bshe is\b", "she's"),
        (r"\bshe has\b", "she's"),
        (r"\bit is\b", "it's"),
        (r"\bit has\b", "it's"),
        (r"\bwe are\b", "we're"),
        (r"\bwe have\b", "we've"),
        (r"\bthey are\b", "they're"),
        (r"\bthey have\b", "they've"),
        (r"\byou are\b", "you're"),
        (r"\byou have\b", "you've"),
        (r"\bthat is\b", "that's"),
        (r"\bthere is\b", "there's"),
        (r"\bthere has\b", "there's"),
        (r"\bwho is\b", "who's"),
        (r"\bwho has\b", "who's"),
        (r"\bwhat is\b", "what's"),
        (r"\bwhat has\b", "what's"),
    ];

    let mut result = String::from(job_description);

    for (pattern, contraction) in &contractions {
        let re = Regex::new(pattern)?;
        result = re.replace_all(&result, *contraction).to_string();
    }

    Ok(result)
}

fn remove_unnecessary_words(job_description: &str) -> Result<String, regex::Error> {
    let unnecessary_words = [
        r"\ba lot of\b",
        r"\bare\b",
        r"\bbeautiful\b",
        r"\bdefinitely\b",
        r"\bextremely\b",
        r"\bfairly\b",
        r"\bgreat\b",
        r"\bincredible\b",
        r"\blots of\b",
        r"\bmany\b",
        r"\bmuch\b",
        r"\bnice\b",
        r"\bplenty of\b",
        r"\bquite a few\b",
        r"\bsome\b",
        r"\bso many\b",
        r"\bsuch\b",
        r"\bthat\b",
        r"\bthat is\b",
        r"\bthe\b",
        r"\bthe very\b",
        r"\btons of\b",
        r"\btruly\b",
        r"\bvery much\b",
        r"\bwonderful\b",
        r"\byou can\b",
    ];

    let mut result = String::from(job_description);

    for word in &unnecessary_words {
        let re = Regex::new(word)?;
        result = re.replace_all(&result, "").to_string();
    }

    Ok(result)
}

fn combine_sentences(job_description: &str) -> Result<String, regex::Error> {
    let re = Regex::new(r"\. ([A-Z])")?;
    Ok(re.replace_all(job_description, ", $1").to_string())
}

fn remove_urls(job_description: &str) -> Result<String, regex::Error> {
    let url_pattern = r"https?://(?:[-\w]+(?::\d+)?(?:/\S*)?)?";
    let re = Regex::new(url_pattern)?;
    Ok(re.replace_all(job_description, "").to_string())
}

fn remove_emails(text: &str) -> Result<String, String> {
    let re = regex::Regex::new(r"\b[\w\.-]+@[\w\.-]+\.\w{2,}\b").unwrap();
    let result = re.replace_all(text, "");
    Ok(result.to_string())
}

fn remove_unnecessary_spaces(job_description: &str) -> Result<String, String> {
    let re = regex::Regex::new(r"\s+").map_err(|e| e.to_string())?;
    let result = re.replace_all(job_description, " ").to_string();
    Ok(result.trim().to_string())
}
