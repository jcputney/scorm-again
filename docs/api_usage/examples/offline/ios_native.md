# Using scorm-again with Native iOS (Swift) for Offline Learning

This guide demonstrates how to implement SCORM content in a native iOS application with offline support using scorm-again.

## Prerequisites

- Xcode 14+ and Swift 5.0+
- Basic knowledge of iOS development with Swift
- Understanding of SCORM packages
- Basic knowledge of WebKit for loading web content

## Setup

### 1. Project Configuration

First, create a new iOS project in Xcode:

1. Open Xcode and select "Create a new Xcode project"
2. Choose "App" as the template
3. Configure your project settings (name, bundle identifier, etc.)
4. Select Swift as the programming language

### 2. Add Dependencies

This implementation requires the following frameworks:

- **WebKit**: For displaying SCORM content via WKWebView
- **ZIPFoundation**: For extracting SCORM packages (add via Swift Package Manager)

To add ZIPFoundation:

1. In Xcode, go to File → Swift Packages → Add Package Dependency
2. Enter the URL: `https://github.com/weichsel/ZIPFoundation.git`
3. Select the latest stable version

### 3. Project Structure

Create a directory structure for storing the scorm-again API:

```
/YourApp
  /Resources
    /ScormAgain
      scorm-again.js
```

Add the `scorm-again.js` file to your Xcode project by:

1. Right-click on your project in the Project Navigator
2. Select "Add Files to 'YourApp'..."
3. Navigate to and select the `scorm-again.js` file
4. Ensure "Copy items if needed" is checked and add to your app target

### 4. Configure App for External Storage

For iOS, we'll use both the app's sandbox documents directory and the shared container for storing SCORM content. 

First, add the necessary permissions in your `Info.plist`:

```xml
<key>NSDocumentsFolderUsageDescription</key>
<string>Access to documents is required to store and load SCORM courses</string>
```

For app groups (shared container), you need to enable app groups capability:

1. Select your project in Xcode
2. Go to "Signing & Capabilities"
3. Click "+ Capability" and add "App Groups"
4. Create a new app group (e.g., "group.com.yourcompany.scormcontent")

## Implementation

### 1. Create a SCORM Storage Manager

Create a class to manage SCORM content storage and access:

```swift
import Foundation
import ZIPFoundation

class ScormStorageManager {
    
    // MARK: - Properties
    
    static let shared = ScormStorageManager()
    
    private let appGroupIdentifier = "group.com.yourcompany.scormcontent"
    private let scormFolderName = "ScormContent"
    
    // MARK: - External Storage Path Methods
    
    /// Returns the shared app group container URL for storing SCORM content
    func getSharedContainerURL() -> URL? {
        return FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupIdentifier)
    }
    
    /// Returns the base directory URL for storing SCORM content
    func getScormBaseDirectory() -> URL? {
        guard let containerURL = getSharedContainerURL() else {
            // Fallback to app's documents directory if app groups aren't available
            let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
            let scormURL = documentsURL?.appendingPathComponent(scormFolderName)
            createDirectoryIfNeeded(at: scormURL)
            return scormURL
        }
        
        let scormURL = containerURL.appendingPathComponent(scormFolderName)
        createDirectoryIfNeeded(at: scormURL)
        return scormURL
    }
    
    /// Returns the directory URL for a specific course
    func getCourseDirectory(courseId: String) -> URL? {
        guard let baseURL = getScormBaseDirectory() else { return nil }
        
        let courseURL = baseURL.appendingPathComponent(courseId)
        createDirectoryIfNeeded(at: courseURL)
        return courseURL
    }
    
    /// Returns the URL for the API JavaScript file
    func getAPIFileURL() -> URL? {
        if let apiURL = Bundle.main.url(forResource: "scorm-again", withExtension: "js", subdirectory: "ScormAgain") {
            return apiURL
        }
        
        // If not found in the bundle, check if we've copied it to the documents directory
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
        return documentsURL?.appendingPathComponent("ScormAgain/scorm-again.js")
    }
    
    // MARK: - File Operations
    
    /// Creates a directory if it doesn't exist
    private func createDirectoryIfNeeded(at url: URL?) {
        guard let url = url else { return }
        
        if !FileManager.default.fileExists(atPath: url.path) {
            do {
                try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
            } catch {
                print("Error creating directory: \(error)")
            }
        }
    }
    
    /// Extracts a SCORM package ZIP file to the course directory
    func extractScormPackage(from zipURL: URL, courseId: String, completion: @escaping (Bool, Error?) -> Void) {
        guard let courseDir = getCourseDirectory(courseId: courseId) else {
            completion(false, NSError(domain: "ScormStorageManager", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to get course directory"]))
            return
        }
        
        // Clear existing course files if they exist
        do {
            if FileManager.default.fileExists(atPath: courseDir.path) {
                try FileManager.default.removeItem(at: courseDir)
                createDirectoryIfNeeded(at: courseDir)
            }
        } catch {
            completion(false, error)
            return
        }
        
        // Extract the zip file
        do {
            try FileManager.default.unzipItem(at: zipURL, to: courseDir)
            
            // Validate the extracted content
            let indexHTML = courseDir.appendingPathComponent("index.html")
            if FileManager.default.fileExists(atPath: indexHTML.path) {
                completion(true, nil)
            } else {
                // If no index.html is found, check if content is in a subdirectory
                let contents = try FileManager.default.contentsOfDirectory(at: courseDir, includingPropertiesForKeys: nil)
                for item in contents {
                    if item.hasDirectoryPath {
                        let nestedIndexHTML = item.appendingPathComponent("index.html")
                        if FileManager.default.fileExists(atPath: nestedIndexHTML.path) {
                            // Move all files from subdirectory to main course directory
                            try moveItemsFromSubdirectory(item, to: courseDir)
                            completion(true, nil)
                            return
                        }
                    }
                }
                
                completion(false, NSError(domain: "ScormStorageManager", code: 2, userInfo: [NSLocalizedDescriptionKey: "Invalid SCORM package: No index.html found"]))
            }
        } catch {
            completion(false, error)
        }
    }
    
    /// Moves items from a subdirectory to the parent directory
    private func moveItemsFromSubdirectory(_ subdirectory: URL, to parentDirectory: URL) throws {
        let contents = try FileManager.default.contentsOfDirectory(at: subdirectory, includingPropertiesForKeys: nil)
        for item in contents {
            let destination = parentDirectory.appendingPathComponent(item.lastPathComponent)
            try FileManager.default.moveItem(at: item, to: destination)
        }
        try FileManager.default.removeItem(at: subdirectory)
    }
    
    /// Copy the API file to the documents directory if needed
    func ensureAPIFileAvailable() -> URL? {
        // Check if API file exists in bundle
        if let bundleAPIURL = Bundle.main.url(forResource: "scorm-again", withExtension: "js", subdirectory: "ScormAgain") {
            return bundleAPIURL
        }
        
        // If not in bundle, copy from a source location to documents directory
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
        let apiDirectoryURL = documentsURL?.appendingPathComponent("ScormAgain")
        let apiFileURL = apiDirectoryURL?.appendingPathComponent("scorm-again.js")
        
        createDirectoryIfNeeded(at: apiDirectoryURL)
        
        // Copy from your source (modify as needed)
        if let sourceAPIURL = Bundle.main.url(forResource: "scorm-again", withExtension: "js"),
           let apiFileURL = apiFileURL,
           !FileManager.default.fileExists(atPath: apiFileURL.path) {
            do {
                try FileManager.default.copyItem(at: sourceAPIURL, to: apiFileURL)
                return apiFileURL
            } catch {
                print("Error copying API file: \(error)")
                return nil
            }
        }
        
        return apiFileURL
    }
    
    /// List all available SCORM courses in external storage
    func listAvailableCourses() -> [ScormCourse] {
        var courses = [ScormCourse]()
        
        guard let baseURL = getScormBaseDirectory() else { return courses }
        
        do {
            let contents = try FileManager.default.contentsOfDirectory(at: baseURL, includingPropertiesForKeys: nil)
            for item in contents {
                if item.hasDirectoryPath {
                    let indexHTML = item.appendingPathComponent("index.html")
                    if FileManager.default.fileExists(atPath: indexHTML.path) {
                        let courseId = item.lastPathComponent
                        let course = ScormCourse(id: courseId, path: item.path, url: indexHTML.absoluteString)
                        courses.append(course)
                    }
                }
            }
        } catch {
            print("Error listing courses: \(error)")
        }
        
        return courses
    }
    
    /// Delete a course from external storage
    func deleteCourse(courseId: String) -> Bool {
        guard let courseDir = getCourseDirectory(courseId: courseId) else { return false }
        
        do {
            if FileManager.default.fileExists(atPath: courseDir.path) {
                try FileManager.default.removeItem(at: courseDir)
                return true
            }
            return false
        } catch {
            print("Error deleting course: \(error)")
            return false
        }
    }
}

// MARK: - Models

struct ScormCourse {
    let id: String
    let path: String
    let url: String
}
```

### 2. Create a SCORM Web View Controller

Create a view controller to manage the WebKit view and SCORM content:

```swift
import UIKit
import WebKit

class ScormPlayerViewController: UIViewController {
    
    // MARK: - Properties
    
    private var webView: WKWebView!
    private var activityIndicator: UIActivityIndicatorView!
    private var isOnline = true
    private var courseId: String
    private var apiURL: URL?
    private var courseURL: URL?
    
    // MARK: - Initialization
    
    init(courseId: String) {
        self.courseId = courseId
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        self.courseId = "default"
        super.init(coder: coder)
    }
    
    // MARK: - View Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
        configureWebView()
        setupNetworkMonitoring()
        loadCourseContent()
    }
    
    // MARK: - UI Setup
    
    private func setupUI() {
        view.backgroundColor = .white
        title = "SCORM Player"
        
        // Setup navigation items
        let syncButton = UIBarButtonItem(image: UIImage(systemName: "arrow.clockwise"), style: .plain, target: self, action: #selector(syncData))
        navigationItem.rightBarButtonItem = syncButton
        
        // Setup activity indicator
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.center = view.center
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        activityIndicator.startAnimating()
    }
    
    private func configureWebView() {
        // Configure preferences
        let preferences = WKPreferences()
        preferences.javaScriptEnabled = true
        
        // Configure WebView configuration
        let configuration = WKWebViewConfiguration()
        configuration.preferences = preferences
        configuration.allowsInlineMediaPlayback = true
        
        // Add script message handler for communication
        let contentController = WKUserContentController()
        contentController.add(self, name: "scormBridge")
        configuration.userContentController = contentController
        
        // Create WebView
        webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.navigationDelegate = self
        webView.isHidden = true
        view.addSubview(webView)
    }
    
    // MARK: - Network Monitoring
    
    private func setupNetworkMonitoring() {
        // Check initial online status
        isOnline = checkNetworkStatus()
        
        // Add notifications for connectivity changes
        NotificationCenter.default.addObserver(self, selector: #selector(networkStatusChanged), name: NSNotification.Name.connectivityStatusChanged, object: nil)
    }
    
    private func checkNetworkStatus() -> Bool {
        // Simplified network check - implement with Reachability or NWPathMonitor in a real app
        return true
    }
    
    @objc private func networkStatusChanged(_ notification: Notification) {
        if let isOnline = notification.object as? Bool {
            self.isOnline = isOnline
            
            // If we just came back online, try to sync data
            if isOnline {
                syncData()
            }
            
            // Update the WebView isOnline status
            updateWebViewOnlineStatus()
        }
    }
    
    // MARK: - Content Loading
    
    private func loadCourseContent() {
        activityIndicator.startAnimating()
        
        // Get the URLs from storage manager
        apiURL = ScormStorageManager.shared.ensureAPIFileAvailable()
        courseURL = ScormStorageManager.shared.getCourseDirectory(courseId: courseId)?.appendingPathComponent("index.html")
        
        guard let courseURL = courseURL else {
            showError(message: "Course not found")
            return
        }
        
        // Load the course in WebView
        let request = URLRequest(url: courseURL)
        webView.load(request)
    }
    
    // MARK: - JavaScript Injection
    
    private func injectScormAPI() {
        guard let apiURL = apiURL?.absoluteString else {
            showError(message: "SCORM API not found")
            return
        }
        
        // JavaScript to inject the SCORM API
        let jsCode = """
        var scormAgainScript = document.createElement('script');
        scormAgainScript.src = '\(apiURL)';
        scormAgainScript.onload = function() {
            // Initialize scorm-again with offline support
            window.API = new window.ScormAgain.SCORM2004API({
                enableOfflineSupport: true,
                courseId: '\(courseId)',
                autocommit: true,
                autocommitSeconds: 60,
                syncOnInitialize: true,
                syncOnTerminate: true,
                logLevel: 4,
                onLogMessage: function(message, level) {
                    window.webkit.messageHandlers.scormBridge.postMessage({
                        type: 'log',
                        message: message,
                        level: level
                    });
                }
            });
            
            // Notify when offline data is synced
            window.API.on('OfflineDataSynced', function() {
                window.webkit.messageHandlers.scormBridge.postMessage({
                    type: 'sync',
                    status: 'success'
                });
            });
            
            // Override the isDeviceOnline method to use our Swift value
            window.API._offlineStorageService.isDeviceOnline = function() {
                return \(isOnline);
            };
        };
        document.head.appendChild(scormAgainScript);
        """
        
        webView.evaluateJavaScript(jsCode) { (result, error) in
            if let error = error {
                print("Error injecting SCORM API: \(error)")
            }
        }
    }
    
    private func updateWebViewOnlineStatus() {
        // Update the online status in the WebView
        let jsCode = """
        if (window.API && window.API._offlineStorageService) {
            window.API._offlineStorageService.isDeviceOnline = function() {
                return \(isOnline);
            };
        }
        """
        
        webView.evaluateJavaScript(jsCode) { (_, _) in }
    }
    
    @objc private func syncData() {
        guard isOnline else {
            showAlert(title: "Offline", message: "Cannot sync while offline")
            return
        }
        
        let jsCode = """
        if (window.API && window.API._offlineStorageService) {
            window.API._offlineStorageService.syncOfflineData().then(function(success) {
                window.webkit.messageHandlers.scormBridge.postMessage({
                    type: 'sync',
                    status: success ? 'success' : 'failed'
                });
            });
        }
        """
        
        webView.evaluateJavaScript(jsCode) { (_, _) in }
    }
    
    // MARK: - Error Handling
    
    private func showError(message: String) {
        activityIndicator.stopAnimating()
        
        let errorLabel = UILabel()
        errorLabel.text = "Error: \(message)"
        errorLabel.textAlignment = .center
        errorLabel.textColor = .red
        errorLabel.numberOfLines = 0
        errorLabel.frame = CGRect(x: 20, y: view.center.y - 50, width: view.bounds.width - 40, height: 100)
        view.addSubview(errorLabel)
    }
    
    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - WKNavigationDelegate

extension ScormPlayerViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        activityIndicator.stopAnimating()
        webView.isHidden = false
        
        // Inject the SCORM API after the page has loaded
        injectScormAPI()
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        showError(message: error.localizedDescription)
    }
}

// MARK: - WKScriptMessageHandler

extension ScormPlayerViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let type = dict["type"] as? String else { return }
        
        switch type {
        case "log":
            if let logMessage = dict["message"] as? String {
                print("SCORM Log: \(logMessage)")
            }
            
        case "sync":
            if let status = dict["status"] as? String, status == "success" {
                DispatchQueue.main.async {
                    self.showAlert(title: "Sync Complete", message: "SCORM data synchronized successfully")
                }
            } else {
                DispatchQueue.main.async {
                    self.showAlert(title: "Sync Failed", message: "Failed to synchronize SCORM data")
                }
            }
            
        default:
            break
        }
    }
}

// MARK: - Network Status Notification

extension NSNotification.Name {
    static let connectivityStatusChanged = NSNotification.Name("connectivityStatusChanged")
}
```

### 3. Create a Course Library View Controller

Create a view controller to list and manage SCORM courses:

```swift
import UIKit

class CourseLibraryViewController: UIViewController {
    
    // MARK: - Properties
    
    private var tableView: UITableView!
    private var courses: [ScormCourse] = []
    private var isOnline = true
    
    // MARK: - View Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
        setupNetworkMonitoring()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadCourses()
    }
    
    // MARK: - UI Setup
    
    private func setupUI() {
        view.backgroundColor = .white
        title = "SCORM Courses"
        
        // Setup table view
        tableView = UITableView(frame: view.bounds, style: .plain)
        tableView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "CourseCell")
        view.addSubview(tableView)
        
        // Add import course button
        let addButton = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(importCourse))
        navigationItem.rightBarButtonItem = addButton
    }
    
    // MARK: - Network Monitoring
    
    private func setupNetworkMonitoring() {
        // Check initial online status
        isOnline = checkNetworkStatus()
        
        // Add notifications for connectivity changes
        NotificationCenter.default.addObserver(self, selector: #selector(networkStatusChanged), name: NSNotification.Name.connectivityStatusChanged, object: nil)
    }
    
    private func checkNetworkStatus() -> Bool {
        // Simplified network check - implement with Reachability or NWPathMonitor in a real app
        return true
    }
    
    @objc private func networkStatusChanged(_ notification: Notification) {
        if let isOnline = notification.object as? Bool {
            self.isOnline = isOnline
            
            // Update UI elements that depend on network status
            navigationItem.rightBarButtonItem?.isEnabled = isOnline
        }
    }
    
    // MARK: - Data Loading
    
    private func loadCourses() {
        courses = ScormStorageManager.shared.listAvailableCourses()
        tableView.reloadData()
    }
    
    // MARK: - Actions
    
    @objc private func importCourse() {
        guard isOnline else {
            showAlert(title: "Offline", message: "Cannot import courses while offline")
            return
        }
        
        // In a real app, you would:
        // 1. Show a file picker or download interface
        // 2. Download or locate the SCORM package
        // 3. Extract it to the course directory
        
        // For this example, we'll simulate importing a course
        showImportCourseDialog()
    }
    
    private func showImportCourseDialog() {
        let alert = UIAlertController(title: "Import Course", message: "Enter course details", preferredStyle: .alert)
        
        alert.addTextField { textField in
            textField.placeholder = "Course ID"
        }
        
        alert.addTextField { textField in
            textField.placeholder = "Course URL"
        }
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Import", style: .default) { [weak self] _ in
            guard let courseId = alert.textFields?[0].text, !courseId.isEmpty,
                  let courseUrl = alert.textFields?[1].text, !courseUrl.isEmpty else {
                self?.showAlert(title: "Error", message: "Please enter both course ID and URL")
                return
            }
            
            self?.downloadAndImportCourse(courseId: courseId, courseUrl: courseUrl)
        })
        
        present(alert, animated: true)
    }
    
    private func downloadAndImportCourse(courseId: String, courseUrl: String) {
        guard let url = URL(string: courseUrl) else {
            showAlert(title: "Error", message: "Invalid URL")
            return
        }
        
        // Show loading indicator
        let activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.center = view.center
        activityIndicator.startAnimating()
        view.addSubview(activityIndicator)
        
        // Download the course (in a real app, use URLSession for better progress tracking)
        let downloadTask = URLSession.shared.downloadTask(with: url) { [weak self] (tempURL, response, error) in
            DispatchQueue.main.async {
                activityIndicator.removeFromSuperview()
                
                if let error = error {
                    self?.showAlert(title: "Download Failed", message: error.localizedDescription)
                    return
                }
                
                guard let tempURL = tempURL else {
                    self?.showAlert(title: "Download Failed", message: "No file received")
                    return
                }
                
                // Extract the SCORM package
                ScormStorageManager.shared.extractScormPackage(from: tempURL, courseId: courseId) { success, extractError in
                    DispatchQueue.main.async {
                        if success {
                            self?.showAlert(title: "Success", message: "Course imported successfully")
                            self?.loadCourses()
                        } else {
                            self?.showAlert(title: "Import Failed", message: extractError?.localizedDescription ?? "Failed to extract SCORM package")
                        }
                    }
                }
            }
        }
        
        downloadTask.resume()
    }
    
    private func deleteCourse(_ course: ScormCourse) {
        let success = ScormStorageManager.shared.deleteCourse(courseId: course.id)
        if success {
            courses.removeAll { $0.id == course.id }
            tableView.reloadData()
        } else {
            showAlert(title: "Error", message: "Failed to delete course")
        }
    }
    
    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - UITableViewDelegate, UITableViewDataSource

extension CourseLibraryViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return courses.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "CourseCell", for: indexPath)
        let course = courses[indexPath.row]
        
        cell.textLabel?.text = course.id
        cell.accessoryType = .disclosureIndicator
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let course = courses[indexPath.row]
        let playerVC = ScormPlayerViewController(courseId: course.id)
        navigationController?.pushViewController(playerVC, animated: true)
    }
    
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            let course = courses[indexPath.row]
            deleteCourse(course)
        }
    }
}
```

### 4. Create a Network Connectivity Monitor

For better network monitoring, create a dedicated class:

```swift
import Foundation
import Network

class NetworkMonitor {
    static let shared = NetworkMonitor()
    
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")
    
    var isConnected: Bool = true
    
    private init() {
        startMonitoring()
    }
    
    func startMonitoring() {
        monitor.pathUpdateHandler = { [weak self] path in
            let isConnected = path.status == .satisfied
            self?.isConnected = isConnected
            
            // Post notification about connectivity change
            DispatchQueue.main.async {
                NotificationCenter.default.post(
                    name: .connectivityStatusChanged,
                    object: isConnected
                )
            }
        }
        
        monitor.start(queue: queue)
    }
    
    func stopMonitoring() {
        monitor.cancel()
    }
}
```

## Working with External Storage

### Importing SCORM Content from Files App

To enhance the user experience, you can allow importing SCORM packages from the iOS Files app:

```swift
import UIKit
import MobileCoreServices
import UniformTypeIdentifiers

extension CourseLibraryViewController: UIDocumentPickerDelegate {
    
    func showDocumentPicker() {
        // Configure document picker for zip files
        let supportedTypes: [UTType] = [UTType.zip]
        let documentPicker = UIDocumentPickerViewController(forOpeningContentTypes: supportedTypes)
        documentPicker.delegate = self
        documentPicker.allowsMultipleSelection = false
        
        present(documentPicker, animated: true)
    }
    
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let selectedFileURL = urls.first else { return }
        
        // Prompt for a course ID
        let alert = UIAlertController(title: "Import Course", message: "Enter a course ID for this package", preferredStyle: .alert)
        
        alert.addTextField { textField in
            textField.placeholder = "Course ID"
            // Suggest a course ID based on filename
            let filename = selectedFileURL.deletingPathExtension().lastPathComponent
            textField.text = filename
        }
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Import", style: .default) { [weak self] _ in
            guard let courseId = alert.textFields?[0].text, !courseId.isEmpty else {
                self?.showAlert(title: "Error", message: "Please enter a course ID")
                return
            }
            
            // Extract the SCORM package
            ScormStorageManager.shared.extractScormPackage(from: selectedFileURL, courseId: courseId) { success, error in
                DispatchQueue.main.async {
                    if success {
                        self?.showAlert(title: "Success", message: "Course imported successfully")
                        self?.loadCourses()
                    } else {
                        self?.showAlert(title: "Import Failed", message: error?.localizedDescription ?? "Failed to extract SCORM package")
                    }
                }
            }
        })
        
        present(alert, animated: true)
    }
}
```

### Exporting SCORM Results

You can also implement functionality to export SCORM results:

```swift
func exportScormResults(courseId: String) {
    let jsCode = """
    if (window.API) {
        var results = window.API.renderCMIToJSONString();
        window.webkit.messageHandlers.scormBridge.postMessage({
            type: 'export',
            courseId: '\(courseId)',
            data: results
        });
    }
    """
    
    webView.evaluateJavaScript(jsCode) { (_, _) in }
}

// Handle the export data in the message handler
func handleExportData(courseId: String, data: String) {
    // Create a file in the Documents directory
    let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let fileURL = documentsURL.appendingPathComponent("\(courseId)_results.json")
    
    do {
        try data.write(to: fileURL, atomically: true, encoding: .utf8)
        
        // Show share sheet for the file
        let activityVC = UIActivityViewController(activityItems: [fileURL], applicationActivities: nil)
        present(activityVC, animated: true)
    } catch {
        showAlert(title: "Export Failed", message: error.localizedDescription)
    }
}
```

## Performance Considerations

### 1. Memory Management

- Release WKWebView resources when the view controller is dismissed
- Clear cached content periodically to prevent excessive storage usage

```swift
override func viewDidDisappear(_ animated: Bool) {
    super.viewDidDisappear(animated)
    
    if isMovingFromParent {
        // Clean up WebView resources
        webView.configuration.userContentController.removeAllScriptMessageHandlers()
        webView.stopLoading()
    }
}
```

### 2. WebView Optimization

Configure WebView for optimal performance:

```swift
let preferences = WKPreferences()
preferences.javaScriptEnabled = true
preferences.javaScriptCanOpenWindowsAutomatically = false

let configuration = WKWebViewConfiguration()
configuration.preferences = preferences
configuration.allowsInlineMediaPlayback = true
configuration.mediaTypesRequiringUserActionForPlayback = []

// Increasing process pool memory
configuration.websiteDataStore = WKWebsiteDataStore.default()
```

### 3. Course Package Management

- Implement background downloading for large SCORM packages
- Add progress indicators for extraction and loading
- Implement package validation to prevent loading invalid content

## Security Considerations

### 1. Content Validation

Always validate SCORM packages before loading them:

```swift
func validateScormPackage(at courseDirectory: URL) -> Bool {
    // Check for essential files
    let indexHTMLExists = FileManager.default.fileExists(atPath: courseDirectory.appendingPathComponent("index.html").path)
    let manifestExists = FileManager.default.fileExists(atPath: courseDirectory.appendingPathComponent("imsmanifest.xml").path)
    
    return indexHTMLExists && manifestExists
}
```

### 2. Data Protection

For sensitive SCORM data, implement encryption:

```swift
// Add data protection to course directories
func protectCourseData(at courseDirectory: URL) {
    do {
        try FileManager.default.setAttributes(
            [FileAttributeKey.protectionKey: FileProtectionType.complete],
            ofItemAtPath: courseDirectory.path
        )
    } catch {
        print("Error setting data protection: \(error)")
    }
}
```

## Conclusion

This native iOS implementation provides a robust foundation for delivering SCORM content with offline support. By leveraging external storage options in iOS, you can efficiently manage larger courses while providing a seamless offline learning experience.

Key benefits of this implementation include:

1. **External Storage**: Using shared containers or app documents directory for scalable course storage
2. **Offline Support**: Fully functional offline learning with synchronization when back online
3. **Native Performance**: Leveraging native iOS capabilities for optimal performance
4. **User Control**: Allowing users to import, export, and manage SCORM content
5. **Security**: Implementing appropriate content validation and data protection

This approach works well for both iPad and iPhone devices and can be extended to support additional features like progress tracking, course analytics, and integration with iOS educational features. 