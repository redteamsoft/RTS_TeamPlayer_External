# Edit here - set path to you directory with config.json & fonts

FONT_DIR ?= .

### Don't edit below ###

FONTELLO_HOST ?= https://fontello.com

open:
	@if test ! `which curl` ; then \
		echo 'Install curl first.' >&2 ; \
		exit 128 ; \
		fi
	curl --silent --show-error --fail --output .fontello --form "config=@${FONT_DIR}/config.json" ${FONTELLO_HOST}
	explorer ${FONTELLO_HOST}/`cat .fontello` | true


save:
	@if test ! `which unzip` ; then \
		echo 'Install unzip first.' >&2 ; \
		exit 128 ; \
		fi
	@if test ! -e .fontello ; then \
		echo 'Run `make fontopen` first.' >&2 ; \
		exit 128 ; \
		fi
	rm -rf .fontello.src .fontello.zip
	curl --silent --show-error --fail --output .fontello.zip \
		${FONTELLO_HOST}/`cat .fontello`/get
	unzip .fontello.zip -d .fontello.src
	cp -R .fontello.src/`ls .fontello.src`/* ${FONT_DIR}
	rm -rf .fontello.src .fontello.zip demo.html LICENSE.txt README.txt