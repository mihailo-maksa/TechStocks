// removes HTML tags from a given string
const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, "");
