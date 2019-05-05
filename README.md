# Touchstone2

Touchstone2 is a web application for designing in controlled experiments. Try out a live server at [touchstone2.org](https://touchstone2.org)


## Requirements

* (On macOS:) Install Xcode. (We use several packages that need Xcode for compiling.)
* Node.js version 8.4. The easiest way to do this is to use [nvm](https://github.com/creationix/nvm#installation-and-update)
  * To install Node.js 8.4, use the command `nvm install 8.4`
  * To switch to Node.js 8.4, use the command `nvm use 8.4`

## Installation

In the source code folder, run `npm install`. (This will take a while.)

## Running

From now on, you can start Touchstone2 by running: `npm run start`

## Logging

Logging is deactivated by default to activate it.

- `HistorySaga.js` uncomment `xmlhttp.send(data)`
- `constants/settings.js` add `UrlLog`

## Credits

Touchstone2 is a work by the [People and Computing Lab (ZPAC) at the University of Zurich](https://zpac.ch) and the [ex)situ lab](https://ex-situ.lri.fr/).

If you use or build upon Touchstone2, please cite the following paper.

> Alexander Eiselmayer, Chat Wacharamanotham, Michel BeaudouinLafon, and Wendy E. Mackay. 2019. Touchstone2: An Interactive Environment for Exploring Trade-offs in HCI Experiment Design. In CHI Conference on Human Factors in Computing Systems Proceedings (CHI 2019), May 4–9, 2019, Glasgow, Scotland Uk. ACM, New York, NY, USA, 11 pages. https://doi.org/10.1145/3290605.3300447


```bibtex
@inproceedings{Eiselmayer:2019:TIE:3290605.3300447,
 author = {Eiselmayer, Alexander and Wacharamanotham, Chat and Beaudouin-Lafon, Michel and Mackay, Wendy E.},
 title = {Touchstone2: An Interactive Environment for Exploring Trade-offs in HCI Experiment Design},
 booktitle = {Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems},
 series = {CHI '19},
 year = {2019},
 isbn = {978-1-4503-5970-2},
 location = {Glasgow, Scotland Uk},
 pages = {217:1--217:11},
 articleno = {217},
 numpages = {11},
 url = {http://doi.acm.org/10.1145/3290605.3300447},
 doi = {10.1145/3290605.3300447},
 acmid = {3300447},
 publisher = {ACM},
 address = {New York, NY, USA},
 keywords = {counterbalancing, experiment design, power analysis, randomization, reproducibility},
} 
```


## Related project

[Touchstone Language (TSL)](https://github.com/ZPAC-UZH/touchstone-language): A declarative language for counterbalancing design.
