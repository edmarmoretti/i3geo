
RATFOR = /home/adrian/bin/ratfor77
CPP = /usr/bin/cpp 

##########################################################
# Sources actually written by humans:

MH_TEMPLATES = cif.h death.h methas.template death.template 

CIF_FOR = dgs.f diggra.f geyer.f lookup.f sftcr.f \
    straush.f straushm.f strauss.f straussm.f 

OTHER_FOR = arand.f aru.f dist2.f dppll.f fexitf.f initaux.f inxyp.f updaux.f

C_SRC = closepair.c corrections.c discarea.c done.c dinfty.c distances.c exactdist.c  exactPdist.c  fexitc.c  massdisthack.c xyseg.c

CC_SRC = PerfectStrauss.cc

C_TEMPLATES = Kborder.cpp Kborder.h

HUMAN = $(MH_TEMPLATES) $(C_TEMPLATES) $(CIF_FOR) $(OTHER_FOR) $(C_SRC) $(CC_SRC) raster.h Makefile

##########################################################
# Source to be generated automatically:

MH_FOR = mh1.f mh2.f mh3.f mh4.f mh5.f mh6.f mh7.f mh8.f mh9.f

DEATH_FOR = deathu.f deathm.f

K_C = Kborder.c Kwborder.c

GENERATED = $(MH_FOR) $(DEATH_FOR) $(K_C)


######################################################
###########  TARGETS ################################

target:	$(GENERATED)
	@echo -- Done -------

tar:
	tar cvf src.tar $(HUMAN)

clean:
	rm $(GENERATED)
	-rm src.tar

#######################################################
#########    RULES   ##################################


.r.f:
	$(RATFOR) -o $@ $?


Kborder.c:	Kborder.cpp
	$(CPP) -C -o $@ Kborder.cpp
	cat Kborder.h $@ > tmp
	mv tmp $@

Kwborder.c:	Kborder.cpp
	$(CPP) -C -DWEIGHTED -o $@ Kborder.cpp
	cat Kborder.h $@ > tmpw
	mv tmpw $@


deathm.r:  $(MH_TEMPLATES)
	$(CPP) -DMARKED -o $@ death.template
	
deathu.r:  $(MH_TEMPLATES)
	$(CPP) -o $@ death.template

	
mh1.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=1 -o $@ methas.template
	
mh2.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=2 -o $@ methas.template
	
mh3.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=3 -o $@ methas.template
	
mh4.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=4 -o $@ methas.template
	
mh5.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=5 -o $@ methas.template
	
mh6.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=6 -o $@ methas.template
	
mh7.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=7 -o $@ methas.template
	
mh8.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=8 -o $@ methas.template
	
mh9.r:  $(MH_TEMPLATES)
	$(CPP) -DNMBR=9 -o $@ methas.template
	




