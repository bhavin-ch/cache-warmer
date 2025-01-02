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
const BatchSize = 10
const Iters = 10
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

func generateUrl (index Index)  {
	color := randColor()
	fit := randFit()
	width := randDim()
	height := randDim()
	url := fmt.Sprintf("%s/images/%d.jpeg?w=%d&h=%d&fit=%s&bg=%s", RootUrl, rand.Intn(MaxIndex), width, height, fit, color)
	fmt.Printf("(%d, %d) -> %s\n", index.batchIndex, index.index, url)
}

func main() {
	rand.New(rand.NewSource(seed))
	for batchIndex := 0; batchIndex < Iters; batchIndex++ {
		for index := 0; index < BatchSize; index++ {
			go generateUrl(Index{batchIndex, index})
		}
	}
}