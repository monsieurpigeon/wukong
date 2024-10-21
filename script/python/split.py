from snownlp import SnowNLP

iter = 1
end = 108

def fun(variable):
    if (variable == ''):
        return False
    else:
        return True

while iter <= end:
    f = open("public/words/" + str(iter) + ".txt", "r")
    array = f.read().replace("|", "").split("\n")
    filtered = filter(fun, array)

    result = []

    for text in filtered:
        s = SnowNLP(text)
        seg_result = s.words
        result.append("|".join(seg_result))

    f = open("public/result/" + str(iter) + ".txt", "x")
    f.write("\n".join(result))

    print("file " + str(iter) + " done")
    iter += 1