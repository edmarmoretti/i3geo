if(dev.cur() <= 1) get(getOption("device"))()

oldpar <- par(ask = interactive() &&
            (.Device %in% c("X11", "GTK", "windows", "Macintosh")))
oldoptions <- options(warn=-1)

fanfare <- function(stuff) {
  plot(c(0,1),c(0,1),type="n",axes=FALSE, xlab="", ylab="")
  text(0.5,0.5, stuff, cex=2.5)
}
fanfare("Spatstat demonstration")
fanfare("I. Types of data")
data(swedishpines)
plot(swedishpines, main="Point pattern")

data(demopat)
plot(demopat, cols=c("green", "blue"), main="Multitype point pattern")

data(longleaf)
plot(longleaf, fg="blue", main="Marked point pattern")

a <- psp(runif(20),runif(20),runif(20),runif(20), window=owin())
plot(a, main="Line segment pattern")

plot(owin(), main="Rectangular window")
data(letterR)
plot(letterR, main="Polygonal window")
plot(as.mask(letterR), main="Binary mask window")

Z <- as.im(function(x,y){ sqrt((x - 1)^2 + (y-1)^2)}, square(2))
plot(Z, main="Pixel image")

fanfare("II. Basic operations")
X <- swedishpines
subset <- 1:20
plot(X[subset], main="subset operation: X[subset]")
subwindow <- owin(poly=list(x=c(0,96,96,40,40),y=c(0,0,100,100,50)))
plot(X[subwindow], main="subset operation: X[subwindow]")

L <- rpoisline(10, owin(c(1.5,4.5),c(0.2,3.6)))
S <- L[letterR]
plot(L, main="subset operation: L[subwindow]")
plot(S, add=TRUE, col="red")

data(lansing)
plot(lansing, "Lansing Woods data")
plot(split(lansing), main="split operation: split(X)")

plot(a, main="Self-crossing points")
plot(selfcrossing.psp(a), add=TRUE, col="red")

fanfare("III. Exploratory data analysis")

plot(swedishpines, main="Quadrat counts", pch="+")
tab <- quadratcount(swedishpines, 4)
plot(tab, add=TRUE, lty=2, cex=2, col="blue")

plot(swedishpines, main="", pch="+")
title(main=expression(chi^2 * " test"), cex.main=2)
tes <- quadrat.test(swedishpines, 3)
tes
plot(tes, add=TRUE, col="red", cex=1.5, lty=2, lwd=3)
title(sub=paste("p-value =", signif(tes$p.value,3)), cex.sub=1.4)

data(cells)
Z <- density.ppp(cells, 0.07)
plot(Z, main="Kernel smoothed intensity of point pattern")
plot(cells, add=TRUE)

D <- density(a, sigma=0.05)
plot(D, main="Kernel smoothed intensity of line segment pattern")
plot(a, add=TRUE)

plot(swedishpines, main="Swedish Pines data")
K <- Kest(swedishpines)
plot(K, main="K function for Swedish Pines")

en <- envelope(swedishpines, fun=Kest, nsim=10, correction="translate")
plot(en, main="Envelopes of K function based on CSR")

pc <- pcf(swedishpines)
plot(pc, main="Pair correlation function")

plot(swedishpines, main="nearest neighbours")
m <- nnwhich(swedishpines)
b <- swedishpines[m]
arrows(swedishpines$x, swedishpines$y, b$x, b$y,
       angle=12, length=0.1, col="red")

plot(swedishpines %mark% (nndist(swedishpines)/2), markscale=1, main="Stienen diagram")

Z <- distmap(swedishpines, dimyx=512)
plot(swedishpines$window, main="Distance map")
plot(Z, add=TRUE)
points(swedishpines)

persp(Z, colmap=terrain.colors(128), shade=0.3, phi=30,theta=100,
      main="perspective plot of pixel image")

a <- psp(runif(20),runif(20),runif(20),runif(20), window=owin())
contour(distmap(a), main="Distance map")
plot(a, add=TRUE,col="red")

plot(allstats(swedishpines))

fanfare("IV. Model-fitting")

data(redwood)
parsave <- par(mfrow=c(1,2))
plot(redwood)
fitT <- thomas.estK(redwood, c(kappa=10,sigma2=0.1))
par(pty="s")
plot(fitT, main="Thomas model\n fit by minimum contrast")
par(parsave)

plot(swedishpines)
fit <- ppm(swedishpines, ~1, Strauss(r=7))
print(fit)

Xsim <- rmh(model=fit,
            start=list(n.start=80),
            control=list(nrep=100))
plot(Xsim, main="Simulation from fitted Strauss model")

data(demopat)
plot(demopat, cols=c("red", "blue"))
plot(alltypes(demopat, "K"))

fit <- ppm(demopat, ~marks + polynom(x,y,2), Poisson())
plot(fit)

fanfare("V. Simulation")

data(letterR)
plot(letterR, main="Poisson random points")
lambda <- 10/area.owin(letterR)
points(rpoispp(lambda, win=letterR))
points(rpoispp(9 * lambda, win=letterR))
points(rpoispp(90 * lambda, win=letterR))
plot(rpoispp(100))
plot(rpoispp(function(x,y){1000 * exp(-3*x)}, 1000))

plot(rMaternII(200, 0.05))
plot(rSSI(0.05, 200))
plot(rThomas(10, 0.2, 5))
plot(rMatClust(10, 0.05, 4))

plot(redwood, main="random thinning - rthin()")
points(rthin(redwood, 0.5), col="green", cex=1.4)

plot(rcell(nx=15))

plot(rsyst(nx=5))
abline(h=(1:4)/5, lty=2)
abline(v=(1:4)/5, lty=2)

plot(rstrat(nx=5))
abline(h=(1:4)/5, lty=2)
abline(v=(1:4)/5, lty=2)

Xg <- rmh(list(cif="geyer", par=c(beta=1.25, gamma=1.6, r=0.2, sat=4.5),
               w=c(0,10,0,10)),
          control=list(nrep=1e4), start=list(n.start=200))
plot(Xg, main=paste("Geyer saturation process\n",
                    "rmh() with cif=\"geyer\""))

plot(rpoisline(10))

fanfare("VI. Programming tools")

plot(Z, main="An image Z")
plot(levelset(Z, 4))
plot(cut(Z, 5))
plot(eval.im(sqrt(Z) - 3))
plot(solutionset(abs(Z - 6) <= 1))

par(oldpar)

showoffK <- function(Y, current, ..., fullpicture,rad) { 
	plot(fullpicture,
             main="Animation using \`applynbd\'\n explaining the K function")
	points(Y, cex=2)
        u <- current
	points(u[1],u[2],pch="+",cex=3)
	theta <- seq(0,2*pi,length=100)
	polygon(u[1]+ rad * cos(theta),u[2]+rad*sin(theta))
	text(u[1]+rad/3,u[2]+rad/2,Y$n,cex=3)
        if(runif(1) < 0.2) Sys.sleep(runif(1, max=0.4))
	return(Y$n)
}
applynbd(redwood, R=0.2, showoffK, fullpicture=redwood, rad=0.2, exclude=TRUE)

options(oldoptions)

