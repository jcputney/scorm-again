# Using scorm-again with Xamarin.MAUI for Offline Learning

This guide demonstrates how to implement SCORM content in a .NET MAUI application with offline support using scorm-again.

## Prerequisites

- Visual Studio 2022 with .NET MAUI workload installed
- Basic knowledge of C#, XAML, and .NET MAUI
- Understanding of SCORM packages

## Setup

### 1. Create a .NET MAUI Project

Create a new .NET MAUI project in Visual Studio:

1. Go to File → New → Project
2. Select ".NET MAUI App" template
3. Configure your project settings and click Create

### 2. Add Dependencies

Add the necessary NuGet packages to your project:

```xml
<ItemGroup>
    <!-- For file operations -->
    <PackageReference Include="System.IO.Compression" Version="4.3.0" />
    
    <!-- For storing preferences -->
    <PackageReference Include="Xamarin.Essentials" Version="1.7.5" />
    
    <!-- For advanced WebView features -->
    <PackageReference Include="Microsoft.Maui.Controls.WebView" Version="7.0.92" />
    
    <!-- For JSON serialization -->
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
</ItemGroup>
```

### 3. Project Structure

Create a directory structure for storing SCORM content:

```
/Resources/Raw
  /scorm-again
    /api
      scorm-again.js
```

## Implementation

### 1. Create Network Connectivity Monitor

First, create a service for monitoring network connectivity:

```csharp
// Services/IConnectivityService.cs
namespace ScormMauiApp.Services
{
    public interface IConnectivityService
    {
        bool IsConnected { get; }
        event EventHandler<bool> ConnectivityChanged;
        void StartMonitoring();
        void StopMonitoring();
    }
}

// Services/ConnectivityService.cs
using Microsoft.Maui.Networking;

namespace ScormMauiApp.Services
{
    public class ConnectivityService : IConnectivityService
    {
        public bool IsConnected => Connectivity.NetworkAccess == NetworkAccess.Internet;
        
        public event EventHandler<bool> ConnectivityChanged;

        public void StartMonitoring()
        {
            Connectivity.ConnectivityChanged += Connectivity_ConnectivityChanged;
        }

        public void StopMonitoring()
        {
            Connectivity.ConnectivityChanged -= Connectivity_ConnectivityChanged;
        }

        private void Connectivity_ConnectivityChanged(object sender, ConnectivityChangedEventArgs e)
        {
            ConnectivityChanged?.Invoke(this, e.NetworkAccess == NetworkAccess.Internet);
        }
    }
}
```

### 2. Create File Operations Manager

```csharp
// Services/IScormFileService.cs
namespace ScormMauiApp.Services
{
    public interface IScormFileService
    {
        Task<bool> CopyScormApiToLocalAsync();
        Task<bool> ExtractScormPackageAsync(string courseId, Stream packageStream);
        string GetScormApiPath();
        string GetCoursePath(string courseId);
        Task<bool> FileExistsAsync(string path);
        Task<IEnumerable<string>> ListCoursesAsync();
    }
}

// Services/ScormFileService.cs
using System.IO.Compression;

namespace ScormMauiApp.Services
{
    public class ScormFileService : IScormFileService
    {
        private readonly string _baseScormPath;
        private readonly string _apiPath;
        private readonly string _coursesPath;
        
        public ScormFileService()
        {
            _baseScormPath = Path.Combine(FileSystem.AppDataDirectory, "ScormContent");
            _apiPath = Path.Combine(_baseScormPath, "api");
            _coursesPath = Path.Combine(_baseScormPath, "courses");
            
            Directory.CreateDirectory(_baseScormPath);
            Directory.CreateDirectory(_apiPath);
            Directory.CreateDirectory(_coursesPath);
        }
        
        public async Task<bool> CopyScormApiToLocalAsync()
        {
            try
            {
                var apiJsPath = Path.Combine(_apiPath, "scorm-again.js");
                
                if (!File.Exists(apiJsPath))
                {
                    using var stream = await FileSystem.OpenAppPackageFileAsync("Resources/Raw/scorm-again/api/scorm-again.js");
                    using var fileStream = File.Create(apiJsPath);
                    await stream.CopyToAsync(fileStream);
                }
                
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error copying SCORM API: {ex.Message}");
                return false;
            }
        }
        
        public async Task<bool> ExtractScormPackageAsync(string courseId, Stream packageStream)
        {
            try
            {
                var courseDir = Path.Combine(_coursesPath, courseId);
                
                if (Directory.Exists(courseDir))
                {
                    Directory.Delete(courseDir, true);
                }
                
                Directory.CreateDirectory(courseDir);
                
                using (var archive = new ZipArchive(packageStream, ZipArchiveMode.Read))
                {
                    archive.ExtractToDirectory(courseDir);
                }
                
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting SCORM package: {ex.Message}");
                return false;
            }
        }
        
        public string GetScormApiPath()
        {
            return $"file://{Path.Combine(_apiPath, "scorm-again.js")}";
        }
        
        public string GetCoursePath(string courseId)
        {
            return $"file://{Path.Combine(_coursesPath, courseId)}";
        }
        
        public Task<bool> FileExistsAsync(string path)
        {
            return Task.FromResult(File.Exists(path));
        }
        
        public Task<IEnumerable<string>> ListCoursesAsync()
        {
            var courses = Directory.GetDirectories(_coursesPath)
                .Select(Path.GetFileName)
                .Where(name => !string.IsNullOrEmpty(name));
                
            return Task.FromResult(courses);
        }
    }
}
```

### 3. Implement Custom WebView Handler

```csharp
// Handlers/ScormWebViewHandler.cs
using Microsoft.Maui.Handlers;
using Microsoft.Maui.Platform;

namespace ScormMauiApp.Handlers
{
    public partial class ScormWebViewHandler : WebViewHandler
    {
        // Platform-specific implementations will be in separate files
    }
}
```

#### Android Implementation

```csharp
// Handlers/ScormWebViewHandler.Android.cs
#if ANDROID
using Android.Webkit;
using Microsoft.Maui.Handlers;
using Microsoft.Maui.Platform;
using ScormMauiApp.Controls;

namespace ScormMauiApp.Handlers
{
    public partial class ScormWebViewHandler : WebViewHandler
    {
        protected override Android.Webkit.WebView CreatePlatformView()
        {
            var webView = base.CreatePlatformView();
            
            // Enable JavaScript
            webView.Settings.JavaScriptEnabled = true;
            webView.Settings.DomStorageEnabled = true;
            webView.Settings.AllowFileAccess = true;
            webView.Settings.AllowContentAccess = true;
            webView.Settings.AllowFileAccessFromFileURLs = true;
            webView.Settings.AllowUniversalAccessFromFileURLs = true;
            
            // Set up JavaScript interface
            if (VirtualView is ScormWebView scormWebView)
            {
                webView.AddJavascriptInterface(
                    new ScormJavascriptInterface(scormWebView), 
                    "CSharpBridge"
                );
            }
            
            return webView;
        }
    }
    
    public class ScormJavascriptInterface : Java.Lang.Object
    {
        private readonly ScormWebView _scormWebView;
        
        public ScormJavascriptInterface(ScormWebView scormWebView)
        {
            _scormWebView = scormWebView;
        }
        
        [Android.Webkit.JavascriptInterface]
        public void PostMessage(string message)
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                _scormWebView.OnMessageReceived(message);
            });
        }
    }
}
#endif
```

#### iOS Implementation

```csharp
// Handlers/ScormWebViewHandler.iOS.cs
#if IOS
using Foundation;
using Microsoft.Maui.Handlers;
using Microsoft.Maui.Platform;
using ScormMauiApp.Controls;
using WebKit;

namespace ScormMauiApp.Handlers
{
    public partial class ScormWebViewHandler : WebViewHandler
    {
        protected override WKWebView CreatePlatformView()
        {
            var config = new WKWebViewConfiguration();
            var preferences = new WKPreferences
            {
                JavaScriptEnabled = true
            };
            
            config.Preferences = preferences;
            
            if (VirtualView is ScormWebView scormWebView)
            {
                var userController = config.UserContentController;
                var scriptMessageHandler = new ScormScriptMessageHandler(scormWebView);
                userController.AddScriptMessageHandler(scriptMessageHandler, "csharpBridge");
            }
            
            var webView = new WKWebView(CoreGraphics.CGRect.Empty, config);
            return webView;
        }
    }
    
    public class ScormScriptMessageHandler : NSObject, IWKScriptMessageHandler
    {
        private readonly ScormWebView _scormWebView;
        
        public ScormScriptMessageHandler(ScormWebView scormWebView)
        {
            _scormWebView = scormWebView;
        }
        
        public void DidReceiveScriptMessage(WKUserContentController userContentController, WKScriptMessage message)
        {
            if (message.Body is NSString nsString)
            {
                MainThread.BeginInvokeOnMainThread(() =>
                {
                    _scormWebView.OnMessageReceived(nsString.ToString());
                });
            }
        }
    }
}
#endif
```

### 4. Create the ScormWebView Control

```csharp
// Controls/ScormWebView.cs
using Microsoft.Maui.Controls;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Windows.Input;

namespace ScormMauiApp.Controls
{
    public class ScormWebView : WebView
    {
        public static readonly BindableProperty ApiPathProperty = 
            BindableProperty.Create(nameof(ApiPath), typeof(string), typeof(ScormWebView), null);
            
        public static readonly BindableProperty CourseIdProperty = 
            BindableProperty.Create(nameof(CourseId), typeof(string), typeof(ScormWebView), null);
            
        public static readonly BindableProperty IsOnlineProperty = 
            BindableProperty.Create(nameof(IsOnline), typeof(bool), typeof(ScormWebView), true);
            
        public static readonly BindableProperty MessageReceivedCommandProperty = 
            BindableProperty.Create(nameof(MessageReceivedCommand), typeof(ICommand), typeof(ScormWebView), null);
            
        public string ApiPath
        {
            get => (string)GetValue(ApiPathProperty);
            set => SetValue(ApiPathProperty, value);
        }
        
        public string CourseId
        {
            get => (string)GetValue(CourseIdProperty);
            set => SetValue(CourseIdProperty, value);
        }
        
        public bool IsOnline
        {
            get => (bool)GetValue(IsOnlineProperty);
            set => SetValue(IsOnlineProperty, value);
        }
        
        public ICommand MessageReceivedCommand
        {
            get => (ICommand)GetValue(MessageReceivedCommandProperty);
            set => SetValue(MessageReceivedCommandProperty, value);
        }
        
        public async void OnMessageReceived(string message)
        {
            try
            {
                var jObject = JObject.Parse(message);
                MessageReceivedCommand?.Execute(jObject);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing message: {ex.Message}");
            }
        }
        
        public void InjectScormAgain()
        {
            if (string.IsNullOrEmpty(ApiPath) || string.IsNullOrEmpty(CourseId))
                return;
                
            var js = @$"
                var scormAgainScript = document.createElement('script');
                scormAgainScript.src = '{ApiPath}';
                scormAgainScript.onload = function() {{
                    window.API = new window.ScormAgain.SCORM2004API({{
                        enableOfflineSupport: true,
                        courseId: '{CourseId}',
                        autocommit: true,
                        autocommitSeconds: 60,
                        syncOnInitialize: true,
                        syncOnTerminate: true,
                        logLevel: 4,
                        onLogMessage: function(message, level) {{
                            #if IOS
                            window.webkit.messageHandlers.csharpBridge.postMessage(JSON.stringify({{
                            #else
                            window.CSharpBridge.postMessage(JSON.stringify({{
                            #endif
                                type: 'log',
                                message: message,
                                level: level
                            }}));
                        }}
                    }});
                    
                    window.API.on('OfflineDataSynced', function() {{
                        #if IOS
                        window.webkit.messageHandlers.csharpBridge.postMessage(JSON.stringify({{
                        #else
                        window.CSharpBridge.postMessage(JSON.stringify({{
                        #endif
                            type: 'sync',
                            status: 'success'
                        }}));
                    }});
                    
                    window.API._offlineStorageService.isDeviceOnline = function() {{
                        return {IsOnline.ToString().ToLower()};
                    }};
                }};
                document.head.appendChild(scormAgainScript);
            ";
            
            EvaluateJavaScriptAsync(js);
        }
        
        public void SyncOfflineData()
        {
            if (!IsOnline)
                return;
                
            var js = @"
                if (window.API && window.API._offlineStorageService) {
                    window.API._offlineStorageService.syncOfflineData().then(function(success) {
                        #if IOS
                        window.webkit.messageHandlers.csharpBridge.postMessage(JSON.stringify({
                        #else
                        window.CSharpBridge.postMessage(JSON.stringify({
                        #endif
                            type: 'sync',
                            status: success ? 'success' : 'failed'
                        }));
                    });
                }
            ";
            
            EvaluateJavaScriptAsync(js);
        }
    }
}
```

### 5. Create View Model

```csharp
// ViewModels/ScormPlayerViewModel.cs
using System.Collections.ObjectModel;
using System.Windows.Input;
using Microsoft.Maui.Controls;
using Newtonsoft.Json.Linq;
using ScormMauiApp.Services;

namespace ScormMauiApp.ViewModels
{
    public class ScormPlayerViewModel : BindableObject
    {
        private readonly IScormFileService _fileService;
        private readonly IConnectivityService _connectivityService;
        
        private bool _isLoading;
        private bool _isOnline;
        private string _coursePath;
        private string _apiPath;
        private string _errorMessage;
        private ObservableCollection<string> _logMessages = new();
        
        public ScormPlayerViewModel(
            IScormFileService fileService,
            IConnectivityService connectivityService)
        {
            _fileService = fileService;
            _connectivityService = connectivityService;
            
            IsOnline = _connectivityService.IsConnected;
            _connectivityService.ConnectivityChanged += OnConnectivityChanged;
            
            MessageReceivedCommand = new Command<JObject>(HandleMessage);
            SyncCommand = new Command(SyncOfflineData, () => IsOnline);
            
            InitializeAsync();
        }
        
        public bool IsLoading
        {
            get => _isLoading;
            set
            {
                if (_isLoading != value)
                {
                    _isLoading = value;
                    OnPropertyChanged();
                }
            }
        }
        
        public bool IsOnline
        {
            get => _isOnline;
            set
            {
                if (_isOnline != value)
                {
                    _isOnline = value;
                    OnPropertyChanged();
                    ((Command)SyncCommand).ChangeCanExecute();
                }
            }
        }
        
        public string CoursePath
        {
            get => _coursePath;
            set
            {
                if (_coursePath != value)
                {
                    _coursePath = value;
                    OnPropertyChanged();
                }
            }
        }
        
        public string ApiPath
        {
            get => _apiPath;
            set
            {
                if (_apiPath != value)
                {
                    _apiPath = value;
                    OnPropertyChanged();
                }
            }
        }
        
        public string ErrorMessage
        {
            get => _errorMessage;
            set
            {
                if (_errorMessage != value)
                {
                    _errorMessage = value;
                    OnPropertyChanged();
                }
            }
        }
        
        public string CourseId { get; set; } = "course1";
        
        public ObservableCollection<string> LogMessages => _logMessages;
        
        public ICommand MessageReceivedCommand { get; }
        public ICommand SyncCommand { get; }
        
        public ScormWebView ScormWebViewControl { get; set; }
        
        private async void InitializeAsync()
        {
            try
            {
                IsLoading = true;
                
                // Copy SCORM API to local storage
                var apiCopied = await _fileService.CopyScormApiToLocalAsync();
                if (!apiCopied)
                {
                    ErrorMessage = "Failed to copy SCORM API";
                    return;
                }
                
                // Get paths
                ApiPath = _fileService.GetScormApiPath();
                CoursePath = _fileService.GetCoursePath(CourseId);
                
                var indexPath = CoursePath.Replace("file://", "") + "/index.html";
                indexPath = indexPath.Replace("//", "/");
                
                if (!await _fileService.FileExistsAsync(indexPath))
                {
                    ErrorMessage = "Course files not found. Please download the course first.";
                    return;
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error initializing SCORM player: {ex.Message}";
            }
            finally
            {
                IsLoading = false;
            }
        }
        
        private void OnConnectivityChanged(object sender, bool isConnected)
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                IsOnline = isConnected;
                
                if (isConnected && ScormWebViewControl != null)
                {
                    SyncOfflineData();
                }
            });
        }
        
        private void HandleMessage(JObject message)
        {
            try
            {
                var type = message["type"]?.ToString();
                
                switch (type)
                {
                    case "log":
                        var logMessage = message["message"]?.ToString();
                        var level = message["level"]?.ToObject<int>() ?? 0;
                        
                        if (!string.IsNullOrEmpty(logMessage))
                        {
                            LogMessages.Add($"[{level}] {logMessage}");
                            Console.WriteLine($"SCORM Log: [{level}] {logMessage}");
                        }
                        break;
                        
                    case "sync":
                        var status = message["status"]?.ToString();
                        var success = status == "success";
                        
                        MainThread.BeginInvokeOnMainThread(() =>
                        {
                            var messageText = success ? 
                                "SCORM data synchronized successfully" : 
                                "Failed to synchronize SCORM data";
                                
                            Application.Current.MainPage.DisplayAlert(
                                "Synchronization", 
                                messageText, 
                                "OK"
                            );
                        });
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error handling message: {ex.Message}");
            }
        }
        
        private void SyncOfflineData()
        {
            ScormWebViewControl?.SyncOfflineData();
        }
    }
}
```

### 6. Create the UI Page

```xml
<!-- Pages/ScormPlayerPage.xaml -->
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:controls="clr-namespace:ScormMauiApp.Controls"
             xmlns:vm="clr-namespace:ScormMauiApp.ViewModels"
             x:Class="ScormMauiApp.Pages.ScormPlayerPage"
             Title="SCORM Course Player">

    <ContentPage.ToolbarItems>
        <ToolbarItem Text="Sync" 
                     Command="{Binding SyncCommand}"
                     IsEnabled="{Binding IsOnline}" />
    </ContentPage.ToolbarItems>

    <Grid RowDefinitions="Auto,*">
        <VerticalStackLayout IsVisible="{Binding IsOnline, Converter={StaticResource InvertedBoolConverter}}"
                           BackgroundColor="#FFF3CD"
                           Padding="10">
            <Label Text="You are currently offline. Changes will be synced when you reconnect."
                 TextColor="#856404" />
        </VerticalStackLayout>

        <Grid Grid.Row="1">
            <!-- Loading state -->
            <ActivityIndicator IsRunning="{Binding IsLoading}"
                             IsVisible="{Binding IsLoading}"
                             HorizontalOptions="Center"
                             VerticalOptions="Center" />

            <!-- Error state -->
            <VerticalStackLayout IsVisible="{Binding ErrorMessage, Converter={StaticResource StringNotEmptyConverter}}"
                               HorizontalOptions="Center"
                               VerticalOptions="Center"
                               Padding="20">
                <Label Text="{Binding ErrorMessage}"
                     TextColor="Red"
                     HorizontalOptions="Center" />
            </VerticalStackLayout>

            <!-- Content state -->
            <controls:ScormWebView x:Name="ScormWebView"
                                 IsVisible="{Binding IsLoading, Converter={StaticResource InvertedBoolConverter}}"
                                 Source="{Binding CoursePath, StringFormat='{0}/index.html'}"
                                 ApiPath="{Binding ApiPath}"
                                 CourseId="{Binding CourseId}"
                                 IsOnline="{Binding IsOnline}"
                                 MessageReceivedCommand="{Binding MessageReceivedCommand}"
                                 Navigated="ScormWebView_Navigated" />
        </Grid>
    </Grid>
</ContentPage>
```

```csharp
// Pages/ScormPlayerPage.xaml.cs
namespace ScormMauiApp.Pages
{
    public partial class ScormPlayerPage : ContentPage
    {
        private readonly ScormPlayerViewModel _viewModel;
        
        public ScormPlayerPage(ScormPlayerViewModel viewModel)
        {
            InitializeComponent();
            _viewModel = viewModel;
            BindingContext = _viewModel;
        }
        
        protected override void OnAppearing()
        {
            base.OnAppearing();
            _viewModel.ScormWebViewControl = ScormWebView;
        }
        
        protected override void OnDisappearing()
        {
            base.OnDisappearing();
            _viewModel.ScormWebViewControl = null;
        }
        
        private void ScormWebView_Navigated(object sender, WebNavigatedEventArgs e)
        {
            if (e.Result == WebNavigationResult.Success)
            {
                // Inject scorm-again JS after the page has loaded
                ScormWebView.InjectScormAgain();
            }
        }
    }
}
```

### 7. Register Services in App Startup

In your `MauiProgram.cs` file, register the required services:

```csharp
// MauiProgram.cs
using Microsoft.Extensions.Logging;
using ScormMauiApp.Handlers;
using ScormMauiApp.Services;
using ScormMauiApp.ViewModels;
using ScormMauiApp.Pages;

namespace ScormMauiApp
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                })
                .ConfigureMauiHandlers(handlers =>
                {
                    handlers.AddHandler<Controls.ScormWebView, ScormWebViewHandler>();
                });

            // Register services
            builder.Services.AddSingleton<IScormFileService, ScormFileService>();
            builder.Services.AddSingleton<IConnectivityService, ConnectivityService>();
            
            // Register view models
            builder.Services.AddTransient<ScormPlayerViewModel>();
            
            // Register pages
            builder.Services.AddTransient<ScormPlayerPage>();

#if DEBUG
            builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}
```

### 8. Loading From External Storage

For loading SCORM content from external storage:

```csharp
// Services/ExternalStorageService.cs
namespace ScormMauiApp.Services
{
    public class ExternalStorageService
    {
        public static async Task<string> GetExternalScormDirectoryAsync()
        {
            try
            {
                #if ANDROID
                // For Android
                var status = await Permissions.RequestAsync<Permissions.StorageRead>();
                if (status != PermissionStatus.Granted)
                {
                    throw new UnauthorizedAccessException("Storage permission not granted");
                }
                
                var externalDir = Android.OS.Environment.GetExternalStoragePublicDirectory(
                    Android.OS.Environment.DirectoryDocuments).AbsolutePath;
                var scormDir = Path.Combine(externalDir, "ScormContent");
                
                #else
                // For iOS we use app's documents directory
                var scormDir = Path.Combine(FileSystem.AppDataDirectory, "ScormContent");
                #endif
                
                if (!Directory.Exists(scormDir))
                {
                    Directory.CreateDirectory(scormDir);
                }
                
                return scormDir;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error accessing external storage: {ex.Message}");
                // Fallback to app data directory
                return Path.Combine(FileSystem.AppDataDirectory, "ScormContent");
            }
        }
        
        public static async Task<string> GetCoursePath(string courseId)
        {
            var baseDir = await GetExternalScormDirectoryAsync();
            var coursePath = Path.Combine(baseDir, "Courses", courseId);
            
            if (!Directory.Exists(coursePath))
            {
                Directory.CreateDirectory(coursePath);
            }
            
            return coursePath;
        }
    }
}
```

Update the `ScormFileService` to use external storage:

```csharp
// Services/ScormFileService.cs (partial update)
public async Task<bool> ExtractScormPackageToExternalAsync(string courseId, Stream packageStream)
{
    try
    {
        var courseDir = await ExternalStorageService.GetCoursePath(courseId);
        
        if (Directory.Exists(courseDir))
        {
            Directory.Delete(courseDir, true);
        }
        
        Directory.CreateDirectory(courseDir);
        
        using (var archive = new ZipArchive(packageStream, ZipArchiveMode.Read))
        {
            archive.ExtractToDirectory(courseDir);
        }
        
        return true;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error extracting SCORM package: {ex.Message}");
        return false;
    }
}

public async Task<string> GetExternalCoursePath(string courseId)
{
    var path = await ExternalStorageService.GetCoursePath(courseId);
    return $"file://{path}";
}
```

### 9. Create a Course Downloader Service

```csharp
// Services/ICourseDownloaderService.cs
namespace ScormMauiApp.Services
{
    public interface ICourseDownloaderService
    {
        Task<bool> DownloadCourse(string courseId, string downloadUrl, IProgress<double> progress = null);
        Task<IEnumerable<string>> ListAvailableCoursesAsync();
    }
}

// Services/CourseDownloaderService.cs
using System.Net.Http;

namespace ScormMauiApp.Services
{
    public class CourseDownloaderService : ICourseDownloaderService
    {
        private readonly IScormFileService _fileService;
        private readonly HttpClient _httpClient;
        
        public CourseDownloaderService(IScormFileService fileService)
        {
            _fileService = fileService;
            _httpClient = new HttpClient();
        }
        
        public async Task<bool> DownloadCourse(string courseId, string downloadUrl, IProgress<double> progress = null)
        {
            try
            {
                // Download the zip file
                var response = await _httpClient.GetAsync(downloadUrl, HttpCompletionOption.ResponseHeadersRead);
                response.EnsureSuccessStatusCode();
                
                var totalBytes = response.Content.Headers.ContentLength ?? -1L;
                var buffer = new byte[8192];
                var bytesCopied = 0L;
                
                using (var contentStream = await response.Content.ReadAsStreamAsync())
                using (var memoryStream = new MemoryStream())
                {
                    while (true)
                    {
                        var bytesRead = await contentStream.ReadAsync(buffer);
                        if (bytesRead == 0) break;
                        
                        await memoryStream.WriteAsync(buffer, 0, bytesRead);
                        
                        bytesCopied += bytesRead;
                        
                        if (totalBytes != -1L && progress != null)
                        {
                            var progressValue = (double)bytesCopied / totalBytes;
                            progress.Report(progressValue);
                        }
                    }
                    
                    // Reset the memory stream position
                    memoryStream.Position = 0;
                    
                    // Extract package to external storage
                    return await _fileService.ExtractScormPackageToExternalAsync(courseId, memoryStream);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error downloading course: {ex.Message}");
                return false;
            }
        }
        
        public async Task<IEnumerable<string>> ListAvailableCoursesAsync()
        {
            try
            {
                // In a real application, this would call an API to get a list of available courses
                // For this example, we'll return a hardcoded list
                await Task.Delay(500); // Simulate network delay
                
                return new List<string>
                {
                    "course1",
                    "course2",
                    "course3"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error listing courses: {ex.Message}");
                return Enumerable.Empty<string>();
            }
        }
    }
}
```

## Key Features of This Implementation

### 1. Cross-Platform Support

- Uses .NET MAUI for cross-platform development
- Provides platform-specific implementations for WebView integration
- Handles file storage adaptively on different platforms

### 2. Network Connectivity Monitoring

- Tracks online/offline status with the `IConnectivityService`
- Automatically updates the UI based on connection status
- Syncs data when the device comes back online

### 3. File Operations

- Manages SCORM files in both app storage and external storage
- Handles extraction of SCORM packages
- Provides access to SCORM API and course content

### 4. WebView Integration

- Custom WebView handler for platform-specific features
- JavaScript bridge for communication with the SCORM API
- Injects scorm-again into the WebView

### 5. scorm-again Configuration

The scorm-again API is initialized with these settings:

```javascript
{
  enableOfflineSupport: true,  // Enable offline capabilities
  courseId: 'course1',         // Unique identifier for the course
  autocommit: true,            // Automatically commit data
  syncOnInitialize: true,      // Try to sync when the API initializes
  syncOnTerminate: true,       // Try to sync when the API terminates
}
```

## Performance Considerations

### 1. Memory Management

- Clean up resources properly when pages are destroyed
- Unsubscribe from events when they're no longer needed
- Use streams efficiently when handling large files

### 2. File Operations

- Perform file operations asynchronously
- Consider using buffered reading for large files
- Cache file paths to avoid repeated directory operations

### 3. WebView Optimization

- Configure WebView settings appropriately for your content needs
- Limit JavaScript calls to when they're needed
- Consider using a hybrid approach with native UI for performance-critical sections

## Security Considerations

### 1. Content Validation

Always validate SCORM packages before loading them:

```csharp
private async Task<bool> ValidateScormPackage(string coursePath)
{
    var indexHtmlExists = File.Exists(Path.Combine(coursePath, "index.html"));
    var manifestExists = File.Exists(Path.Combine(coursePath, "imsmanifest.xml"));
    
    return indexHtmlExists && manifestExists;
}
```

### 2. Data Protection

For sensitive SCORM data, consider implementing secure storage:

```csharp
// Services/SecureStorageService.cs
using Microsoft.Maui.Storage;

namespace ScormMauiApp.Services
{
    public class SecureStorageService
    {
        public static async Task StoreSecurely(string key, string value)
        {
            await SecureStorage.Default.SetAsync(key, value);
        }
        
        public static async Task<string> RetrieveSecurely(string key)
        {
            return await SecureStorage.Default.GetAsync(key);
        }
    }
}
```

## Troubleshooting

### Common Issues

1. **WebView JavaScript Bridge Communication**
   - Ensure message handlers are properly registered
   - Check that JavaScript interfaces are correctly implemented
   - Verify that the bridge name matches in both directions

2. **File Access Issues**
   - Verify file paths are correct and accessible
   - Check that necessary permissions are granted
   - Ensure assets are properly bundled with the application

3. **Platform-Specific Issues**
   - For Android: Add necessary permissions in AndroidManifest.xml
   - For iOS: Configure appropriate App Transport Security settings
   - Check platform-specific file path handling

## Conclusion

This .NET MAUI implementation provides a robust cross-platform solution for implementing SCORM content with offline support. By leveraging .NET MAUI's capabilities for WebView and file operations while implementing scorm-again's offline features, you can deliver a consistent learning experience across both Android and iOS platforms. 