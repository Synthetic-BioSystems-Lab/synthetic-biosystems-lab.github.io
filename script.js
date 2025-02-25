async function fetchORCIDPublications(orcidID) {
    const response = await fetch(`https://pub.orcid.org/v3.0/${orcidID}/works`, {
        headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    return data.group.map(work => {
        const summary = work["work-summary"][0];
        const title = summary["title"]["title"].value;
        const journal = summary["journal-title"] ? summary["journal-title"].value : "Unknown Journal";
        const year = summary["publication-date"] ? summary["publication-date"]["year"].value : "n.d.";
        const url = summary["url"] ? summary["url"].value : "#";

        let authors = "et al.";
        if (summary["contributors"] && summary["contributors"]["contributor"]) {
            const contributorList = summary["contributors"]["contributor"];
            if (contributorList.length >= 2) {
                authors = `${contributorList[0]["credit-name"].value}, ${contributorList[1]["credit-name"].value}, et al.`;
            } else if (contributorList.length === 1) {
                authors = `${contributorList[0]["credit-name"].value}, et al.`;
            }
        }

        return `<li class='mb-2'><a href="${url}" target="_blank" class="hover:underline">${authors} ${title}. <i>${journal}</i>, <b>${year}</b>.</a></li>`;
    }).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
    const orcidID = "0000-0002-4844-6605";
    document.getElementById("orcid-publications").innerHTML = await fetchORCIDPublications(orcidID);
});