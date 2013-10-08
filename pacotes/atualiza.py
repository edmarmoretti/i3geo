#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Created on Fri Jan 11 17:26:01 2013

@author: Diego
@email: moreira.geo@gmail.com
"""
import os, subprocess
import sqlite3
import os

TABELA_ORIGINAL = 'tb_proxy'

tables = {}
tables[TABELA_ORIGINAL] =  [[u'id', u'INTEGER PRIMARY KEY'],
                        [u'proxy', u'TEXT'],
                        [u'port', u'TEXT'],
                        [u'user', u'TEXT'],
                        [u'password', u'TEXT'],
                        [u'exceptions', u'TEXT']]   

class ProxyDB():
    def __init__(self, path, nome):
        self.con = self.getDB(path, nome)      
        if not self.isMetadadosDB(): 
            self.createTables()

    def getDB(self, path, nome):
        banco = os.path.join(path,nome)
        if os.path.exists(path):
                try:
                    con = sqlite3.connect(banco)
                    return con
                except:
                    print 'Não foi possível criar uma conecção com o BD:{0}'\
                    .format(banco)
                    return None
        else:
            print 'Não foi possível encontrar o caminho especificado:{0}'\
                    .format(banco)
            return None
        
    
    def isMetadadosDB(self):
        cur = self.con.cursor() 
        tablesNames = tables.keys()
        for i in tablesNames:
            teste = False
            for j in cur.execute("select name from sqlite_master where type ='table'"):
                teste = i ==  j[0]
                if teste:
                    break
            if not teste:
                return teste
        return teste
            
    def createTables(self):
        tablesName = tables.keys()
        tablesName.reverse()
        for table in tablesName :
            sql = "CREATE TABLE {0}(".format(table)
            columns = tables.get(table)
            column = columns.pop(0)
            sql = "{0} {1} {2}".format(sql, column[0], column[1])
            for column in columns:
                sql = "{0}, {1} {2}".format(sql, column[0], column[1])
            sql = "{0});".format(sql)
            cur = self.con.cursor()
            cur.execute(sql)
            self.con.commit()
            
    def inserirItem(self, nomeTabela, dicionario):
        sql = "INSERT INTO {0}".format(nomeTabela)
        columns = dicionario.keys()
        values = []
        for key in columns:
            value = dicionario.get(key)
            if type(value) == str:
                values.append("'{0}'".format(value))
            else:
                values.append(str(value))
       
        sql = '{0} {1} VALUES {2}'.format(sql,  str(columns).replace("'", ''), \
                 str(values).replace('"', '')).replace('[','(').replace(']',')')
        cur = self.con.cursor()
        cur.execute(sql)
        self.con.commit()
        
    def obterProxyList(self):
        cur = self.con.cursor()
        proxyDict = {}
        for e in cur.execute("SELECT id, proxy, port, user, password, exceptions FROM tb_proxy"):
            proxyDict[e[0]] = {'proxy':e[1], 'port':e[2], 'user':e[3], 'password':e[4], 'exceptions':e[5] }
        return proxyDict
        
  
    def save(self):
        self.con.commit()
        
    def close(self):
        self.con.close()

PROJECT_ROOT_PATH =  os.path.realpath(os.path.dirname(__file__))
metadadosDB = ProxyDB(PROJECT_ROOT_PATH, 'proxy.db')
    
def validaEntradaSN(msg):
    while True:
        var = raw_input(msg)
        if var.upper() == 'S':
            return True
        elif var.upper() == 'N':
            return False

def validaEntradaTexto(msg):
    while True:
        var = raw_input(msg)
        if len(var) > 0:
            return var
        
def validaEntradaNumero(msg):
    while True:
        var = raw_input(msg)
        if len(var) > 0:
            try:
                int(var)
                return var
            except:
                print 'O valor deve ser do tipo interio!'
    return None

def insertProxy():
    continua = True
    proxyDict = {}
    while continua :
        proxyDict['proxy'] = validaEntradaTexto("Informe o proxy: ") 
        proxyDict['port'] = validaEntradaNumero("Informe a porta: ")
        if validaEntradaSN("Seu proxy requer autenticação? (S ou N)\n>> "):
            proxyDict['user'] = validaEntradaTexto("Informe o usuário: ")
            proxyDict['password'] = validaEntradaTexto("Informe a senha: ")
        if validaEntradaSN("Você quer cadastrar exceções? (S ou N)\n>> "):
            proxyDict['exceptions'] = validaEntradaTexto("Informe as exceções: ")

        for i in proxyDict:
            print i, '\t- ', proxyDict[i]
            
        msg = "Esta é a configurção de proxy que será utilizada:\nEla está correta? (S ou N)\n>>"
        if validaEntradaSN(msg):
            continua = False
            metadadosDB.inserirItem(TABELA_ORIGINAL, proxyDict)
            '''serversPath = os.path.join(PROJECT_ROOT_PATH,'.subversion/servers')
            serversFile = open(serversPath,'a+b')
            serversFile.write("http-proxy-host = {0}\n".format(proxy))
            serversFile.write("http-proxy-port = {0}\n".format(porta))
            if usuario:
                serversFile.write("http-proxy-username = {0}\n".format(usuario))
                serversFile.write("http-proxy-password = {0}\n".format(senha)) 
            serversFile.close()
            atualiza_info_file = open(atualizaPath,'w')
            atualiza_info_file.close()'''

        else:
            for i in proxyDict.keys():
                proxyDict[i] = ''
    return proxyDict

def proxy():
    
    texto = "Se você utiliza um proxy para acessar a web é necessário que o proxy seja configurado para fazer o update.\
    Caso você configure o proxy e o update não seja executado com sucesso, procure o seu administrador da rede e informe a ele o seguinte:\n\
    1 - Arquivo local que armazena as configurações do proxy para o svn: {0}\n\
    2 - É preciso que o servidor proxy suporte os seguintes métodos: PROPFIND, REPORT, MERGE, MKACTIVITY, CHECKOUT.\n\
    3 - Mais informações: http://subversion.apache.org/faq.html#proxy\n\n".format(os.path.join(PROJECT_ROOT_PATH,'.subversion/servers'))

    print texto    
    
   
    a = metadadosDB.obterProxyList()
    if len(a): 
        print 'Escolha a configuração que deseja utilizar:'
        for i in a:
            print i,' - ', a[i]['proxy'],a[i]['port'],a[i]['user'],a[i]['password'],a[i]['exceptions']
        metadadosDB.close() 
    
    var = int(validaEntradaNumero("Digite o número do proxy desejado ou 0 para inserir um novo\n>> "))
    
    proxyDict = None
    if var == 0:
        proxyDict = insertProxy()
    else:
        if var in a:
            proxyDict = a[var]
        else: 
            print 'Opção inválida!'
            return
    utilizarProxy(proxyDict)   

def utilizarProxy(proxyDict):
    serversPath = os.path.join(PROJECT_ROOT_PATH,'.subversion/servers')
    serversFile = open(serversPath,'w')
    serversFile.write("[global]\n")
    
    fileDict = {'proxy': 'http-proxy-host = ',
    'port':'http-proxy-port = ',
    'user': 'http-proxy-username',
    'password':'http-proxy-username = ',
    'exceptions':'http-proxy-password = '}
    
    for k,v in proxyDict.items():
        if v:
            serversFile.write(fileDict[k] + v + '\n')
    serversFile.close()
    atualiza()        

def atualiza():

    print 'Escolha o que você deseja atualizar:'
    print '1 - I3Geo'
    print '2 - Docs'
    print 'Outro número - Tudo'

    var = int(validaEntradaNumero("Digite o número do proxy desejado ou 0 para inserir um novo\n>> "))
    
    diretorio = '/var/www'
    os.chdir(diretorio)	
    print 'Limpando diretório...'
    subprocess.call(["svn","cleanup"], stdout=0) 

    if var == 1:
        diretorio = '/var/www/i3geo'
    elif var == 2:
        diretorio = '/var/www/docs'
    print 'Atualizando ', diretorio         
    os.chdir(diretorio)
    subprocess.call(["svn","update"], stdout=0) 
    raw_input("Pressione qualquer tecla para sair.")

def limparProxy():
    serversPath = os.path.join(PROJECT_ROOT_PATH,'.subversion/servers')
    serversFile = open(serversPath,'w')
    serversFile.close()
       
if __name__ == '__main__':
    continua = True
    while continua :
        print 'Opções:'
        print '0 - Atualizar'
        print '1 - Configurar Proxy e Atualizar'
        print '2 - Limpar proxy'
        print '3 - Sair'
        var = int(validaEntradaNumero("Escolha: "))
        if var == 0:
            atualiza()
	    continua = False
        elif var == 1:
            proxy()
        elif var == 2: 
            limparProxy()
        elif var == 3: 
            continua = False        
        
 
