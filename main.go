package main

import (
	"encoding/json"
	"log"
	"net/http"

	"gopkg.in/neurosnap/sentences.v1"
	"gopkg.in/neurosnap/sentences.v1/english"
)

var COMMITHASH string

type Tokens struct {
	Sentences []int `json:"sentences"`
}

func getSentences(w http.ResponseWriter, r *http.Request, tokenizer sentences.SentenceTokenizer) {
	r.ParseForm()
	text := r.FormValue("text")
	if text == "" {
		text = r.URL.Query().Get("text")
	}

	if text == "" {
		// TODO
		// send 400 error with json response
		return
	}

	sents := tokenizer.Tokenize(text)

	sentences := make([]int, 0, len(sents))
	for _, s := range sents {
		sentences = append(sentences, s.End)
	}

	content := &Tokens{sentences}
	resp, err := json.Marshal(content)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(resp)
}

func main() {
	tokenizer, err := english.NewSentenceTokenizer(nil)
	if err != nil {
		panic(err)
	}

	http.HandleFunc("/sentences/", func(w http.ResponseWriter, r *http.Request) {
		getSentences(w, r, tokenizer)
	})

	http.Handle("/", http.FileServer(FS(false)))
	log.Fatal(http.ListenAndServe(":3010", nil))
}
