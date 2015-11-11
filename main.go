package main

import (
	"encoding/json"
	"html/template"
	"net/http"

	"github.com/neurosnap/sentences/data"
	"github.com/neurosnap/sentences/punkt"
)

type Tokens struct {
	Sentences []string `json:"sentences"`
}

func index(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("index.html")
	t.Execute(w, nil)
}

func sentences(w http.ResponseWriter, r *http.Request, tokenizer punkt.SentenceTokenizer) {
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

	content := &Tokens{tokenizer.Tokenize(text)}
	resp, err := json.Marshal(content)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(resp)
}

func main() {
	data, _ := data.Asset("data/english.json")
	training, _ := punkt.LoadTraining(data)

	tokenizer := punkt.NewSentenceTokenizer(training)

	http.HandleFunc("/", index)
	http.HandleFunc("/sentences/", func(w http.ResponseWriter, r *http.Request) {
		sentences(w, r, tokenizer)
	})

	fs := http.FileServer(http.Dir("public"))
	http.Handle("/public/", http.StripPrefix("/public/", fs))

	http.ListenAndServe(":3000", nil)
}
