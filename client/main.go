package main

import (
	"fmt"
	"math/rand"
	"time"
)

type Index struct {
	batchIndex int
	index int
}

type Url struct {
	url string
	index Index
}

const MaxIndex = 2193
const MaxDims = 256
const BatchSize = 100
const Iters = 100
const RootUrl = "http://localhost:8080"

var seed int64 = time.Now().UnixNano()
var fits = []string{"contain", "cover", "fill", "inside", "outside"}

func toHex (n int) string {
	hex := fmt.Sprintf("%x", n)
	if len(hex) == 1 {
		return "0" + hex
	} else {
		return hex
	}
}

func randFit () string {
	return fits[rand.Intn(len(fits))]
}

func randColor () string {
	r := rand.Intn(256)
	g := rand.Intn(256)
	b := rand.Intn(256)
	return fmt.Sprintf("%s%s%s", toHex(r), toHex(g), toHex(b))
}

func randDim () int {
	return rand.Intn(MaxDims) * 100
}

func generateUrl (index Index, ch chan<- Url)  {
	color := randColor()
	fit := randFit()
	width := randDim()
	height := randDim()
	url := fmt.Sprintf("%s/images/%d.jpeg?w=%d&h=%d&fit=%s&bg=%s", RootUrl, rand.Intn(MaxIndex), width, height, fit, color)
	ch<- Url{url, index}
}

func main() {
	rand.New(rand.NewSource(seed))
	urlsChan := make(chan Url)
	urls := make([]Url, BatchSize)

	for batchIndex := 0; batchIndex < Iters; batchIndex++ {
		for index := 0; index < BatchSize; index++ {
			go generateUrl(Index{batchIndex, index}, urlsChan)
			urls[index] = <-urlsChan
			fmt.Printf("(%d, %d) -> %s\n", urls[index].index.batchIndex, urls[index].index.index, urls[index].url)
		}
	}
}